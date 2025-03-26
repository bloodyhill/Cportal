import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<{
    totalClients: number;
    activeOrders: number;
    pendingInvoices: number;
    totalRevenue: number;
  }>({
    queryKey: ['/api/stats'],
  });

  return (
    <div className="p-4 md:p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
              <Skeleton className="h-12 w-12 rounded-full mb-3" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Clients"
              value={stats?.totalClients || 0}
              icon="people"
              iconBgColor="bg-blue-100 dark:bg-blue-900"
              iconColor="text-primary-dark dark:text-primary-light"
            />
            <StatCard
              title="Active Orders"
              value={stats?.activeOrders || 0}
              icon="shopping_cart"
              iconBgColor="bg-green-100 dark:bg-green-900"
              iconColor="text-success"
            />
            <StatCard
              title="Pending Invoices"
              value={stats?.pendingInvoices || 0}
              icon="receipt"
              iconBgColor="bg-yellow-100 dark:bg-yellow-900"
              iconColor="text-warning"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalRevenue || 0)}
              icon="payments"
              iconBgColor="bg-indigo-100 dark:bg-indigo-900"
              iconColor="text-indigo-600 dark:text-indigo-400"
            />
          </>
        )}
      </div>

      {/* Recent Clients */}
      <RecentClients />

      {/* Recent Orders & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <RecentInvoices />
      </div>
    </div>
  );
}
