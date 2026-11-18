import {useRef} from 'react';
import {data} from 'react-router';
import type {Route} from './+types/contact';
import {AppointmentForm} from '~/components/contact/AppointmentForm';
import {
  validateAppointment,
  type AppointmentResult,
} from '~/components/contact/appointment';
import {
  CONTAINER,
  Eyebrow,
  SplitWords,
  useScrollReveal,
} from '~/components/site/ui';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Contact & Bespoke Fittings | Hatwater House'},
    {
      name: 'description',
      content:
        'Book a bespoke hat fitting, consultation or studio visit with Hatwater House.',
    },
  ];
};

export const handle = {fullBleed: true};

// TODO(brief): add the confirmed studio address, opening hours and contact
// details. Hours are deliberately not shown until they are verified.
const STUDIO = {
  location: ['Hatwater House', 'Los Angeles, California'],
  email: 'hello@hatwaterhouse.com',
};

const STEPS = [
  {title: 'Request', copy: 'Tell us what you have in mind and when suits you.'},
  {title: 'Confirm', copy: 'We reply within one business day to set a time.'},
  {title: 'Fitting', copy: 'Measure, choose felt and shape – in person or online.'},
];

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData();
  const {values, inspiration, errors} = validateAppointment(formData);

  if (Object.keys(errors).length) {
    return data<AppointmentResult>({ok: false, errors}, {status: 400});
  }

  // TODO: forward the request (and `inspiration`, if any) to the studio inbox
  // or CRM. Until then it is only logged on the server.
  console.info('Appointment request', {
    appointmentType: values.appointmentType,
    preferredTime: values.preferredTime,
    contactMethod: values.contactMethod,
    attachment: inspiration ? `${inspiration.type}, ${inspiration.size} bytes` : null,
  });

  return data<AppointmentResult>({
    ok: true,
    name: values.name,
    appointmentType: values.appointmentType,
  });
}

export default function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  useGsapContext(rootRef, () => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({defaults: {ease: 'expo.out'}})
      .from('[data-intro="title"] [data-word]', {
        yPercent: 115,
        duration: 1.2,
        stagger: 0.07,
      })
      .from(
        '[data-intro="fade"]',
        {autoAlpha: 0, y: 24, duration: 1, stagger: 0.1},
        0.35,
      );
  });

  return (
    <div ref={rootRef} className="hw-page bg-hw-cream font-grotesk text-hw-espresso">
      <header
        className={`${CONTAINER} grid gap-[clamp(24px,3vw,56px)] pb-[clamp(40px,5vw,96px)] pt-[clamp(48px,7vw,130px)] lg:grid-cols-[1.4fr_1fr] lg:items-end`}
      >
        <div className="flex flex-col gap-[clamp(18px,1.6vw,28px)]">
          <div data-intro="fade">
            <Eyebrow>Contact & bespoke fittings</Eyebrow>
          </div>
          <h1
            data-intro="title"
            className="m-0 font-display text-[clamp(52px,7.4vw,142px)] font-normal capitalize leading-[0.95] tracking-[-0.01em] text-hw-espresso"
          >
            <SplitWords text="Let’s make your hat" />
          </h1>
        </div>
        <p
          data-intro="fade"
          className="m-0 max-w-[44ch] text-[clamp(16px,1.1vw,20px)] leading-[1.6] text-hw-taupe lg:pb-[0.6vw]"
        >
          Discover Hatwater House in Los Angeles, or request an appointment
          below to begin a commission guided by personal style, proportion,
          and the finer details.
        </p>
      </header>

      <section
        id="appointment"
        aria-labelledby="appointment-heading"
        className="scroll-mt-6 border-t border-hw-espresso/10 bg-hw-linen/60 py-[clamp(56px,7vw,140px)]"
      >
        <div
          className={`${CONTAINER} grid gap-[clamp(48px,6vw,120px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]`}
        >
          <div className="flex flex-col gap-[clamp(32px,3vw,56px)]">
            <div
              id="visit"
              data-reveal
              className="flex scroll-mt-6 flex-col gap-4"
            >
              <h2 className="m-0 font-display text-[clamp(30px,2.6vw,50px)] font-normal leading-[1.05] text-hw-espresso">
                Visit the House
              </h2>
              <address className="flex flex-col gap-1 text-[clamp(15px,1vw,18px)] not-italic leading-[1.6] text-hw-taupe">
                {STUDIO.location.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <span className="text-[13px] uppercase tracking-[0.16em] text-hw-copper">
                  Appointments encouraged. Walk-ins welcome.
                </span>
              </address>
            </div>

            <div data-reveal className="flex flex-col gap-2">
              <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-hw-espresso">
                Write to us
              </p>
              <a
                href={`mailto:${STUDIO.email}`}
                className="self-start border-b border-hw-espresso/30 pb-0.5 font-display text-[clamp(22px,1.6vw,30px)] text-hw-espresso no-underline transition-colors hover:border-hw-espresso hover:no-underline"
              >
                {STUDIO.email}
              </a>
            </div>

            <ol data-reveal className="m-0 flex list-none flex-col gap-5 p-0">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hw-copper/50 text-[12px] font-medium text-hw-copper">
                    {index + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-hw-espresso">
                      {step.title}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-hw-taupe">
                      {step.copy}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div data-reveal className="flex flex-col gap-[clamp(24px,2.4vw,40px)] bg-hw-cream p-[clamp(20px,3.4vw,64px)] shadow-[0_30px_80px_-40px_rgba(85,49,25,0.35)]">
            <div className="flex flex-col gap-3">
              <h2
                id="appointment-heading"
                className="m-0 font-display text-[clamp(32px,2.8vw,54px)] font-normal capitalize leading-[1.05] text-hw-espresso"
              >
                Appointment request
              </h2>
              <p className="m-0 max-w-[56ch] text-[15px] leading-[1.6] text-hw-taupe">
                Share a few details and we’ll confirm your fitting. An
                inspiration photo helps us prepare.
              </p>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </section>
    </div>
  );
}
