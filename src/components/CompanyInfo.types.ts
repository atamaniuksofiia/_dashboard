import { ReactNode } from "react";

export type CompanyInfo = {
  incCountry: ReactNode;
  website: ReactNode;
  ticker: string;
  name: string;
  legal_name: string;
  stock_exchange: string;
  short_description: string;
  long_description: string;
  company_url?: string;
  business_address: string;
  business_phone_no?: string;
  entity_legal_form?: string;
  latest_filing_date?: string;
  hq_country?: string;
  employees?: number;
  sector?: string;
  industry_category?: string;
  industry_group?: string;
  id: string;
};

export type WindowID = 'window1' | 'window2' | 'window3';