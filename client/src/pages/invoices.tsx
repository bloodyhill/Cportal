import { InvoiceList } from "@/components/invoices/invoice-list";

export default function Invoices() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-6 md:hidden">Invoices</h2>
      <InvoiceList />
    </div>
  );
}
