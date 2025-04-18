import { useEffect, useState } from "react";
import { CompanyInfo } from "./CompanyInfo.types";
import companyDataImport from "../data/companies-lookup.json";

const CompanyInfoWidget = ({ ticker = "AAPL" }) => {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const companyData = companyDataImport as unknown as CompanyInfo[];

  useEffect(() => {
    setLoading(true);
    const foundCompany = companyData.find((c) => c.ticker === ticker);
    setCompany(foundCompany || null);
    setLoading(false);
  }, [companyData, ticker]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!company) return <div className="p-4">Company not found</div>;
  console.log("CompanyInfoWidget rendered with:", ticker, company);
  return (
    <div className="bg-gray-100 text-gray-800 p-6 shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4 border-b pb-2 border-gray-600">
        Company Info
      </h2>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Ticker:</span> {company.ticker}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {company.name}
        </div>
        <div>
          <span className="font-semibold">Legal Name:</span>{" "}
          {company.legal_name}
        </div>
        <div>
          <span className="font-semibold">Stock Exchange:</span>{" "}
          {company.stock_exchange}
        </div>
        <div>
          <span className="font-semibold">Short Description:</span>
          <p className="mt-1 text-gray-700">{company.short_description}</p>
        </div>
        <div>
          <span className="font-semibold">Long Description:</span>
          <p className="mt-1 text-gray-700">{company.long_description}</p>
        </div>
        <div>
          <span className="font-semibold">WEB:</span>{" "}
          <a
            href={`https://${company.company_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400underline"
          >
            {company.company_url}
          </a>
        </div>
        <div>
          <span className="font-semibold">Business Address:</span>{" "}
          {company.business_address}
        </div>
        <div>
          <span className="font-semibold">Business Phone:</span>{" "}
          {company.business_phone_no}
        </div>
        <div>
          <span className="font-semibold">Entity Legal Form:</span>{" "}
          {company.entity_legal_form}
        </div>
        <div>
          <span className="font-semibold">Latest Filing Date:</span>{" "}
          {company.latest_filing_date}
        </div>
        <div>
          <span className="font-semibold">Inc Country:</span>{" "}
          {company.hq_country}
        </div>
        <div>
          <span className="font-semibold">Employees:</span>{" "}
          {company.employees?.toLocaleString() || "—"}
        </div>
        <div>
          <span className="font-semibold">Sector:</span> {company.sector}
        </div>
        <div>
          <span className="font-semibold">Industry category:</span>{" "}
          {company.industry_category}
        </div>
        <div>
          <span className="font-semibold">Industry group:</span>{" "}
          {company.industry_group}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoWidget;
