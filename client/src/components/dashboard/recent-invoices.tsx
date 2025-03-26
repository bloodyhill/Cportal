import { useQuery } from "@tanstack/react-query";
import { type Invoice } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientName } from "../../hooks/use-client-name";
import { formatCurrency } from "../../lib/utils";

export function RecentInvoices() {
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const getClientName = useClientName();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="material-icons text-success mr-3">payments</span>;
      case "pending":
        return <span className="material-icons text-warning mr-3">pending</span>;
      case "overdue":
        return <span className="material-icons text-error mr-3">highlight_off</span>;
      default:
        return <span className="material-icons text-neutral-400 mr-3">receipt</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "overdue":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-neutral-500 dark:text-neutral-400";
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-200">Recent Invoices</h3>
        <Link href="/invoices" className="text-primary-dark dark:text-primary-light hover:underline text-sm flex items-center">
          View All <span className="material-icons text-sm ml-1">chevron_right</span>
        </Link>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <li key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 mt-1 ml-auto" />
                </div>
              </li>
            ))
          ) : invoices && invoices.length > 0 ? (
            invoices.slice(0, 4).map((invoice) => (
              <li key={invoice.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {getClientName(invoice.orderId)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <p className={`text-xs ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="py-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No invoices found. Create your first invoice to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
