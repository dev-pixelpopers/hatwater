// Imports the Squarespace exports in public/assets/imports into Shopify via the Admin API.
// Auth first:  npx shopify store auth --store <shop>.myshopify.com --scopes read_products,write_products,...
// Usage:       node scripts/import-squarespace.mjs [--dry-run] [--only=products,customers,orders]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const DIR = 'public/assets/imports';
const TAG = 'squarespace-import';
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const ONLY = (args.find((a) => a.startsWith('--only='))?.split('=')[1] ?? 'products,customers,orders').split(',');
const STORE = fs.readFileSync('.env', 'utf8').match(/^PUBLIC_STORE_DOMAIN="?([^"\r\n]+)/m)[1];
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'sq-import-'));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let f = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { f += '"'; i++; } else q = false;
      } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push(row); row = []; f = '';
    } else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [h, ...rest] = rows;
  return rest
    .filter((r) => r.some(Boolean))
    .map((r) => Object.fromEntries(h.map((k, i) => [k.replace(/^﻿/, ''), r[i] ?? ''])));
}
const readCsv = (name) => parseCsv(fs.readFileSync(`${DIR}/${name}`, 'utf8'));

let n = 0;
function gql(query, variables = {}) {
  const isMutation = /^\s*mutation/.test(query);
  if (DRY && isMutation) {
    console.log('  [dry-run] would run mutation with', JSON.stringify(variables).slice(0, 400), '...');
    return null;
  }
  const id = n++;
  const qf = path.join(TMP, `q${id}.graphql`);
  const vf = path.join(TMP, `v${id}.json`);
  const of = path.join(TMP, `o${id}.json`);
  fs.writeFileSync(qf, query);
  fs.writeFileSync(vf, JSON.stringify(variables));
  const cliArgs = ['shopify', 'store', 'execute', '-s', STORE, '--query-file', qf, '--variable-file', vf, '--output-file', of, '--no-color'];
  if (isMutation) cliArgs.push('--allow-mutations');
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', cliArgs, {stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32'});
  const out = JSON.parse(fs.readFileSync(of, 'utf8'));
  const data = out.data ?? out;
  if (out.errors) throw new Error(JSON.stringify(out.errors));
  return data;
}
function userErrors(result) {
  const errs = Object.values(result ?? {}).flatMap((v) => v?.userErrors ?? []);
  if (errs.length) throw new Error(JSON.stringify(errs, null, 2));
}

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Pacific Rim was exported as "Rabbit Beaver Blend"; every other product uses "Rabbit / Beaver Blend".
const normValue = (name, value) => (name === 'Material' && value === 'Rabbit Beaver Blend' ? 'Rabbit / Beaver Blend' : value);

// ---------------------------------------------------------------- products
async function importProducts() {
  // Squarespace puts product fields on the first row only; following rows are its variants.
  const products = [];
  for (const r of readCsv('products.csv')) {
    if (r.Title) products.push({head: r, rows: []});
    products.at(-1).rows.push(r);
  }

  const publications = DRY ? [] : gql(`query { publications(first: 20) { nodes { id name } } }`).publications.nodes;

  for (const {head, rows} of products) {
    const optionNames = [1, 2, 3, 4, 5, 6].map((i) => head[`Option Name ${i}`]).filter(Boolean);
    const productOptions = optionNames.map((name, idx) => ({
      name,
      values: [...new Set(rows.map((r) => normValue(name, r[`Option Value ${idx + 1}`])).filter(Boolean))].map((v) => ({name: v})),
    }));
    const variants = rows.map((r) => {
      const onSale = r['On Sale'] === 'Yes' && Number(r['Sale Price']) > 0;
      return {
        optionValues: optionNames.map((name, idx) => ({optionName: name, name: normValue(name, r[`Option Value ${idx + 1}`])})),
        sku: r.SKU || undefined,
        barcode: r.GTIN || undefined,
        price: onSale ? r['Sale Price'] : r.Price,
        compareAtPrice: onSale ? r.Price : null,
        taxable: true,
        // Squarespace stock is "Unlimited" for every variant, so inventory is not tracked.
        inventoryPolicy: 'CONTINUE',
        inventoryItem: {
          tracked: r.Stock !== 'Unlimited' && r.Stock !== '',
          requiresShipping: head['Product Type [Non Editable]'] === 'PHYSICAL',
          measurement: r.Weight ? {weight: {value: Number(r.Weight), unit: 'POUNDS'}} : undefined,
        },
      };
    });
    const images = head['Hosted Image URLs'].split(/\s+/).filter(Boolean);
    const handle = slug(head.Title);
    const input = {
      title: head.Title,
      handle,
      descriptionHtml: head.Description,
      status: head.Visible === 'Yes' ? 'ACTIVE' : 'DRAFT',
      tags: [TAG, ...head.Tags.split(',').map((t) => t.trim()).filter(Boolean)],
      productOptions,
      variants,
    };

    console.log(`Product "${head.Title}" (${handle}): ${variants.length} variants, ${images.length} images, ${input.status}`);
    const existing = DRY ? null : gql(`query($q: String!) { products(first: 1, query: $q) { nodes { id media(first: 50) { nodes { id } } } } }`, {q: `handle:${handle}`}).products.nodes[0];
    // Only attach images on first creation so re-runs don't duplicate them.
    if (!existing?.media.nodes.length) input.files = images.map((url, i) => ({originalSource: url, contentType: 'IMAGE', alt: `${head.Title} ${i + 1}`}));

    const res = gql(
      `mutation($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
        productSet(input: $input, identifier: $identifier, synchronous: true) {
          product { id handle variantsCount { count } }
          userErrors { field message code }
        }
      }`,
      {input, identifier: existing ? {id: existing.id} : null},
    );
    if (!res) continue;
    userErrors(res);
    const product = res.productSet.product;
    console.log(`  ${existing ? 'updated' : 'created'} ${product.id} with ${product.variantsCount.count} variants`);

    if (head.Visible === 'Yes' && publications.length) {
      userErrors(
        gql(
          `mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { field message } } }`,
          {id: product.id, input: publications.map((p) => ({publicationId: p.id}))},
        ),
      );
      console.log(`  published to: ${publications.map((p) => p.name).join(', ')}`);
    }
  }
}

// ---------------------------------------------------------------- customers
function address(r, prefix, provinceKey) {
  const a = {
    address1: r[`${prefix} Address 1`],
    address2: r[`${prefix} Address 2`],
    city: r[`${prefix} City`],
    zip: r[`${prefix} Zip`],
    province: r[`${prefix} ${provinceKey}`],
    country: r[`${prefix} Country`],
    phone: r[`${prefix} Phone Number`],
  };
  return a.address1 ? a : null;
}

async function findCustomer(email) {
  if (DRY) return null;
  return gql(`query($q: String!) { customers(first: 1, query: $q) { nodes { id email } } }`, {q: `email:${email}`}).customers.nodes[0] ?? null;
}

async function importCustomers() {
  for (const r of readCsv('profiles.csv')) {
    console.log(`Customer ${r.Email}`);
    if (await findCustomer(r.Email)) { console.log('  already exists, skipping'); continue; }
    const addresses = [address(r, 'Shipping', 'Province/State'), address(r, 'Billing', 'Province/State')].filter(Boolean);
    const input = {
      email: r.Email,
      firstName: r['First Name'] || undefined,
      lastName: r['Last Name'] || undefined,
      phone: r['Phone Number'] || undefined,
      tags: [TAG, ...r.Tags.split(',').map((t) => t.trim()).filter(Boolean)],
      note: `Imported from Squarespace. Created on ${r['Created On']}.`,
      addresses: addresses.length ? addresses : undefined,
      emailMarketingConsent: r['Accepts Email Marketing'] === 'true' ? {marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN'} : undefined,
    };
    const res = gql(
      `mutation($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { field message } } }`,
      {input},
    );
    if (!res) continue;
    userErrors(res);
    console.log(`  created ${res.customerCreate.customer.id}`);
  }
}

// ---------------------------------------------------------------- orders
const toIso = (s) => (s ? new Date(s.replace(' ', 'T').replace(/ ([+-]\d{2})(\d{2})$/, '$1:$2')).toISOString() : undefined);
const money = (amount, currencyCode) => ({shopMoney: {amount, currencyCode}});

async function importOrders() {
  const orders = new Map();
  for (const r of readCsv('orders.csv')) {
    if (!orders.has(r['Order ID'])) orders.set(r['Order ID'], {head: r, lines: []});
    orders.get(r['Order ID']).lines.push(r);
  }
  const TAX_COLUMNS = ['CA Tax', 'Los Angeles Tax', 'CA Local Tax'];

  for (const [orderId, {head, lines}] of orders) {
    const cur = head.Currency;
    const orderTag = `squarespace-order-${orderId}`;
    console.log(`Order ${orderId} (${head.Email}): ${lines.length} line items, total ${head.Total} ${cur}`);
    if (!DRY && gql(`query($q: String!) { orders(first: 1, query: $q) { nodes { id } } }`, {q: `tag:${orderTag}`}).orders.nodes.length) {
      console.log('  already imported, skipping');
      continue;
    }

    const lineItems = lines.map((l) => {
      const variant = DRY ? null : gql(`query($q: String!) { productVariants(first: 1, query: $q) { nodes { id } } }`, {q: `sku:${l['Lineitem sku']}`}).productVariants.nodes[0];
      if (!DRY && !variant) console.log(`  warning: no variant with SKU ${l['Lineitem sku']}, adding as custom line item`);
      return variant
        ? {variantId: variant.id, quantity: Number(l['Lineitem quantity']), priceSet: money(l['Lineitem price'], cur), requiresShipping: l['Lineitem requires shipping'] === 'true', taxable: l['Lineitem taxable'] === 'true'}
        : {title: l['Lineitem name'], variantTitle: l['Lineitem variant'], sku: l['Lineitem sku'], quantity: Number(l['Lineitem quantity']), priceSet: money(l['Lineitem price'], cur), requiresShipping: l['Lineitem requires shipping'] === 'true', taxable: l['Lineitem taxable'] === 'true'};
    });
    const subtotal = Number(head.Subtotal) - Number(head['Discount Amount'] || 0);
    const taxLines = TAX_COLUMNS.filter((c) => Number(head[c]) > 0).map((c) => ({
      title: c,
      rate: subtotal ? Number((Number(head[c]) / subtotal).toFixed(4)) : 0,
      priceSet: money(head[c], cur),
    }));
    const customer = await findCustomer(head.Email);
    const order = {
      name: `#SQ${orderId}`,
      email: head.Email,
      currency: cur,
      processedAt: toIso(head['Created at']),
      financialStatus: head['Financial Status'] === 'PAID' ? 'PAID' : undefined,
      fulfillmentStatus: head['Fulfillment Status'] === 'FULFILLED' ? 'FULFILLED' : undefined,
      lineItems,
      taxLines,
      shippingLines: Number(head.Shipping) > 0 ? [{title: head['Shipping Method'] || 'Shipping', priceSet: money(head.Shipping, cur)}] : undefined,
      discountCode: head['Discount Code'] ? {itemFixedDiscountCode: {code: head['Discount Code'], amountSet: money(head['Discount Amount'], cur)}} : undefined,
      transactions: head['Financial Status'] === 'PAID' ? [{kind: 'SALE', status: 'SUCCESS', gateway: 'Squarespace', amountSet: money(head.Total, cur), processedAt: toIso(head['Paid at'])}] : undefined,
      customer: customer ? {toAssociate: {id: customer.id}} : undefined,
      tags: [TAG, orderTag],
      note: `Imported from Squarespace (${head['Channel Type']} order ${head['Channel Order Number']}). Payment reference: ${head['Payment Reference']}.${head['Private Notes'] ? ' ' + head['Private Notes'] : ''}`,
    };
    const res = gql(
      `mutation($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
        orderCreate(order: $order, options: $options) { order { id name totalPriceSet { shopMoney { amount currencyCode } } } userErrors { field message } }
      }`,
      {order, options: {sendReceipt: false, sendFulfillmentReceipt: false, inventoryBehaviour: 'BYPASS'}},
    );
    if (!res) continue;
    userErrors(res);
    const o = res.orderCreate.order;
    console.log(`  created ${o.name} (${o.id}) total ${o.totalPriceSet.shopMoney.amount} ${o.totalPriceSet.shopMoney.currencyCode}`);
  }
}

console.log(`Store: ${STORE}${DRY ? ' (dry run)' : ''}`);
if (ONLY.includes('products')) await importProducts();
if (ONLY.includes('customers')) await importCustomers();
if (ONLY.includes('orders')) await importOrders();
fs.rmSync(TMP, {recursive: true, force: true});
console.log('Done.');
