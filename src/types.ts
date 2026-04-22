export interface CompanyDetails {
  name: string;
  logoUrl?: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxNumber?: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  date: string;
  expiryDate: string;
  company: CompanyDetails;
  client: ClientDetails;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
}
