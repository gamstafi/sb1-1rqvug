export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface AccountingPlan {
  id: string;
  name: string;
  code: string;
  accounts: Account[];
}

export interface Account {
  code: string;
  name: string;
  type: string;
  description?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  defaultVatRate?: number;
}

export interface VatRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault?: boolean;
}

export interface NotificationSetting {
  type: 'email' | 'sms' | 'app';
  enabled: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  events: string[];
}

export interface AppSettings {
  language: string;
  theme: 'light' | 'dark';
  currency: string;
  accountingPlan: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  vatRates: VatRate[];
  productCategories: ProductCategory[];
  notifications: NotificationSetting[];
  autoBackup: boolean;
  backupFrequency?: 'daily' | 'weekly' | 'monthly';
  integrations: {
    accounting?: string[];
    payment?: string[];
  };
}