import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';
import {
  ACCEPTED_FILES,
  APPOINTMENT_TYPES,
  CONTACT_METHODS,
  type AppointmentField,
  type AppointmentResult,
} from './appointment';

const LABEL =
  'flex items-center gap-1 font-grotesk text-[12px] font-bold uppercase tracking-[0.16em] text-hw-espresso';
const CONTROL =
  'w-full rounded-none border border-hw-sand bg-white px-4 font-grotesk text-[15px] text-hw-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-hw-taupe/55 hover:border-hw-copper/60 focus:border-hw-espresso focus:shadow-[0_0_0_3px_rgba(167,114,67,0.18)] user-invalid:border-hw-rust aria-[invalid=true]:border-hw-rust';
const INPUT = `${CONTROL} h-[52px]`;
const SELECT = `${CONTROL} h-[52px] cursor-pointer appearance-none pr-11 invalid:text-hw-taupe/55`;

function Field({
  id,
  label,
  required = false,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && (
          <span aria-hidden className="text-hw-copper">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="m-0 animate-[hw-pop_0.3s_ease-out] font-grotesk text-[13px] text-hw-rust"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      fill="none"
      className="pointer-events-none absolute right-4 top-1/2 w-[11px] -translate-y-1/2 text-hw-espresso"
    >
      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PaperPlane({className = ''}: {className?: string}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 11.5 21 3l-7.5 18-2.6-7.4L3 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.9 13.6 21 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Bespoke appointment request. Posts multipart form data (with the optional
 * inspiration photo) to the contact route action through a fetcher, so the
 * page never reloads; a success swaps the form for an animated confirmation.
 */
export function AppointmentForm() {
  const fetcher = useFetcher<AppointmentResult>();
  const id = useId();
  const [fileName, setFileName] = useState('');
  const [minTime, setMinTime] = useState<string>();
  const [confirmed, setConfirmed] = useState<
    Extract<AppointmentResult, {ok: true}> | null
  >(null);
  const submitting = fetcher.state !== 'idle';
  const result = fetcher.data;
  const errors: Partial<Record<AppointmentField, string>> =
    result && !result.ok ? result.errors : {};

  // Only allow future times; computed on the client to avoid SSR mismatch.
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && result?.ok) setConfirmed(result);
  }, [fetcher.state, result]);

  const fieldId = (name: AppointmentField) => `${id}-${name}`;
  const a11y = (name: AppointmentField) =>
    errors[name]
      ? {'aria-invalid': true, 'aria-describedby': `${fieldId(name)}-error`}
      : {};

  if (confirmed) {
    return (
      <Confirmation
        name={confirmed.name}
        appointmentType={confirmed.appointmentType}
        onReset={() => {
          setConfirmed(null);
          setFileName('');
        }}
      />
    );
  }

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="grid max-w-none grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2"
      aria-busy={submitting}
    >
      <Field id={fieldId('name')} label="Name" required error={errors.name}>
        <input
          id={fieldId('name')}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          className={INPUT}
          {...a11y('name')}
        />
      </Field>
      <Field id={fieldId('phone')} label="Phone" required error={errors.phone}>
        <input
          id={fieldId('phone')}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          minLength={7}
          placeholder="Your phone number"
          className={INPUT}
          {...a11y('phone')}
        />
      </Field>

      <Field id={fieldId('email')} label="Email" required error={errors.email}>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={INPUT}
          {...a11y('email')}
        />
      </Field>
      <Field
        id={fieldId('appointmentType')}
        label="Appointment type"
        required
        error={errors.appointmentType}
      >
        <span className="relative block">
          <select
            id={fieldId('appointmentType')}
            name="appointmentType"
            required
            defaultValue=""
            className={SELECT}
            {...a11y('appointmentType')}
          >
            <option value="" disabled>
              Select appointment type
            </option>
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type} value={type} className="text-hw-ink">
                {type}
              </option>
            ))}
          </select>
          <Chevron />
        </span>
      </Field>

      <Field
        id={fieldId('preferredTime')}
        label="Preferred time"
        required
        error={errors.preferredTime}
      >
        <input
          id={fieldId('preferredTime')}
          name="preferredTime"
          type="datetime-local"
          required
          min={minTime}
          className={`${INPUT} cursor-pointer [color-scheme:light]`}
          {...a11y('preferredTime')}
        />
      </Field>
      <Field
        id={fieldId('contactMethod')}
        label="Preferred contact method"
        required
        error={errors.contactMethod}
      >
        <span className="relative block">
          <select
            id={fieldId('contactMethod')}
            name="contactMethod"
            required
            defaultValue=""
            className={SELECT}
            {...a11y('contactMethod')}
          >
            <option value="" disabled>
              Select contact method
            </option>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method} className="text-hw-ink">
                {method}
              </option>
            ))}
          </select>
          <Chevron />
        </span>
      </Field>

      <Field
        id={fieldId('message')}
        label="Message"
        error={errors.message}
        className="md:col-span-2"
      >
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="Tell us about the hat style, size, occasion, or any special requirements..."
          className={`${CONTROL} resize-y py-3.5 leading-relaxed`}
          {...a11y('message')}
        />
      </Field>

      <Field
        id={fieldId('inspiration')}
        label="Inspiration photo upload"
        error={errors.inspiration}
        className="md:col-span-2"
      >
        {/* The real input is visually hidden; the wrapper is its label. */}
        <label
          htmlFor={fieldId('inspiration')}
          className={`group flex h-[52px] cursor-pointer items-stretch border bg-white transition-[border-color,box-shadow] duration-300 hover:border-hw-copper/60 has-[:focus-visible]:border-hw-espresso has-[:focus-visible]:shadow-[0_0_0_3px_rgba(167,114,67,0.18)] ${
            errors.inspiration ? 'border-hw-rust' : 'border-hw-sand'
          }`}
        >
          <input
            id={fieldId('inspiration')}
            name="inspiration"
            type="file"
            accept={ACCEPTED_FILES}
            className="sr-only"
            aria-describedby={`${fieldId('inspiration')}-help`}
            onChange={(event) =>
              setFileName(event.currentTarget.files?.[0]?.name ?? '')
            }
          />
          <span className="flex shrink-0 items-center bg-[#1C120C] px-5 font-grotesk text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 group-hover:bg-hw-espresso">
            Choose file
          </span>
          <span
            className={`flex min-w-0 items-center truncate px-4 font-grotesk text-[15px] ${
              fileName ? 'text-hw-ink' : 'text-hw-taupe/55'
            }`}
          >
            <span className="truncate">{fileName || 'No file chosen'}</span>
          </span>
        </label>
        <p
          id={`${fieldId('inspiration')}-help`}
          className="m-0 font-grotesk text-[13px] text-hw-taupe"
        >
          Accepted formats: JPG, PNG, WEBP and PDF.
        </p>
      </Field>

      <div className="flex flex-col-reverse items-stretch gap-4 md:col-span-2 md:flex-row md:items-center md:justify-end">
        <p className="m-0 font-grotesk text-[13px] text-hw-taupe md:mr-auto">
          <span className="text-hw-copper">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex h-[56px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-none border-0 bg-[#1C120C] px-8 font-grotesk text-[13px] font-bold uppercase tracking-widest text-white transition-[background-color,opacity] duration-300 hover:bg-hw-espresso disabled:cursor-wait disabled:opacity-90"
        >
          {submitting ? (
            <>
              <span
                aria-hidden
                className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Sending request…
            </>
          ) : (
            <>
              Request appointment
              <PaperPlane className="size-[18px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {submitting
          ? 'Sending your request'
          : Object.keys(errors).length
            ? 'Please check the highlighted fields.'
            : ''}
      </p>
    </fetcher.Form>
  );
}

function Confirmation({
  name,
  appointmentType,
  onReset,
}: {
  name: string;
  appointmentType: string;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useGsapContext(ref, () => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({defaults: {ease: 'expo.out'}})
      .from(ref.current, {autoAlpha: 0, y: 24, duration: 0.8})
      .from('[data-confirm="ring"]', {scale: 0.4, autoAlpha: 0, duration: 0.9}, 0.1)
      .fromTo(
        '[data-confirm="check"]',
        {strokeDashoffset: 1},
        {strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut'},
        0.45,
      )
      .from(
        '[data-confirm="text"]',
        {autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1},
        0.5,
      );
  });

  const firstName = name.split(' ')[0];

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="flex flex-col items-start gap-6 border border-hw-sand bg-white px-[clamp(24px,3vw,56px)] py-[clamp(40px,4vw,72px)] outline-none"
    >
      <span
        data-confirm="ring"
        className="flex size-16 items-center justify-center rounded-full bg-hw-espresso text-hw-bone"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-7">
          <path
            data-confirm="check"
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
          />
        </svg>
      </span>
      <h3
        data-confirm="text"
        className="m-0 font-display text-[clamp(30px,2.6vw,48px)] font-normal capitalize leading-[1.05] text-hw-espresso"
      >
        Thank you, {firstName}.
      </h3>
      <p
        data-confirm="text"
        className="m-0 max-w-[48ch] font-grotesk text-[16px] leading-[1.7] text-hw-taupe"
      >
        Your request for a <strong className="text-hw-espresso">{appointmentType}</strong>{' '}
        is with the atelier. We’ll be in touch within one business day to
        confirm a time that suits you.
      </p>
      <button
        data-confirm="text"
        type="button"
        onClick={onReset}
        className="cursor-pointer border-0 border-b border-hw-espresso/40 bg-transparent p-0 pb-1 font-grotesk text-[12px] font-bold uppercase tracking-[0.16em] text-hw-espresso transition-colors hover:border-hw-espresso"
      >
        Send another request
      </button>
    </div>
  );
}
