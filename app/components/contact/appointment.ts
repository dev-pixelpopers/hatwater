export const APPOINTMENT_TYPES = [
  'Bespoke Hat Fitting',
  'Custom Hat Consultation',
  'Virtual Styling Session',
  'Private Studio Visit',
  'Hat Restoration & Care',
] as const;

export const CONTACT_METHODS = [
  'Email',
  'Phone Call',
  'Text / SMS',
  'WhatsApp',
] as const;

export const ACCEPTED_FILES = '.jpg,.jpeg,.png,.webp,.pdf';
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|webp|pdf)$/i;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export type AppointmentField =
  | 'name'
  | 'phone'
  | 'email'
  | 'appointmentType'
  | 'preferredTime'
  | 'contactMethod'
  | 'message'
  | 'inspiration';

export type AppointmentResult =
  | {ok: true; name: string; appointmentType: string}
  | {ok: false; errors: Partial<Record<AppointmentField, string>>};

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

/** Server-side validation of the appointment request form. */
export function validateAppointment(formData: FormData) {
  const errors: Partial<Record<AppointmentField, string>> = {};
  const values = {
    name: text(formData, 'name'),
    phone: text(formData, 'phone'),
    email: text(formData, 'email'),
    appointmentType: text(formData, 'appointmentType'),
    preferredTime: text(formData, 'preferredTime'),
    contactMethod: text(formData, 'contactMethod'),
    message: text(formData, 'message'),
  };

  if (values.name.length < 2) errors.name = 'Please enter your full name.';
  if (values.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (
    !APPOINTMENT_TYPES.includes(
      values.appointmentType as (typeof APPOINTMENT_TYPES)[number],
    )
  ) {
    errors.appointmentType = 'Please choose an appointment type.';
  }
  if (!values.preferredTime || Number.isNaN(Date.parse(values.preferredTime))) {
    errors.preferredTime = 'Please choose a preferred date and time.';
  }
  if (
    !CONTACT_METHODS.includes(
      values.contactMethod as (typeof CONTACT_METHODS)[number],
    )
  ) {
    errors.contactMethod = 'Please choose how we should contact you.';
  }
  if (values.message.length > 2000) {
    errors.message = 'Please keep your message under 2,000 characters.';
  }

  const file = formData.get('inspiration');
  const inspiration = file instanceof File && file.size > 0 ? file : null;
  if (inspiration) {
    if (!ACCEPTED_EXTENSIONS.test(inspiration.name)) {
      errors.inspiration = 'Please upload a JPG, PNG, WEBP or PDF file.';
    } else if (inspiration.size > MAX_FILE_BYTES) {
      errors.inspiration = 'Please upload a file under 10 MB.';
    }
  }

  return {values, inspiration, errors};
}
