export const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية', dir: 'rtl' },
];

export const currencies = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'MAD', label: 'Moroccan Dirham (MAD)' },
  // Add more currencies...
];

export const timezones = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
  { value: 'Europe/London', label: 'London (UTC)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (UTC+1)' },
  // Add more timezones...
];

export const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export const numberFormats = [
  { value: 'fr', label: '1 234,56' },
  { value: 'en', label: '1,234.56' },
  { value: 'de', label: '1.234,56' },
];

export const accountingPlans = [
  {
    id: 'pcg',
    name: 'Plan Comptable Général (France)',
    code: 'PCG',
  },
  {
    id: 'ohada',
    name: 'Plan OHADA',
    code: 'OHADA',
  },
  {
    id: 'morocco',
    name: 'Plan Comptable Marocain',
    code: 'PCM',
  },
];