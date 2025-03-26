import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Client, Order, Invoice } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type TimeRange = "all" | "week" | "month" | "quarter" | "year";

export default function Reports() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  const { data: clients, isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });
  
  const { data: invoices, isLoading: isInvoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  // Filter data based on time range
  const getFilteredData = (data: any[], dateField: string) => {
    if (!data || !data.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate = new Date(0); // all time
    }
    
    return data.filter(item => new Date(item[dateField]) >= cutoffDate);
  };

  // Prepare data for charts
  const filteredOrders = orders ? getFilteredData(orders, "orderDate") : [];
  const filteredInvoices = invoices ? getFilteredData(invoices, "issueDate") : [];
  
  // Revenue by status chart data
  const revenueByStatus = [
    { name: "Paid", value: filteredInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0) },
    { name: "Pending", value: filteredInvoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0) },
    { name: "Overdue", value: filteredInvoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0) }
  ].filter(item => item.value > 0);

  // Orders by client chart data
  const ordersByClient = clients && orders ? 
    clients.map(client => ({
      name: client.name,
      orders: orders.filter(order => order.clientId === client.id).length,
      revenue: orders.filter(order => order.clientId === client.id).reduce((sum, order) => sum + order.value, 0)
    })).filter(item => item.orders > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 5) :
    [];

  // Monthly revenue data
  const getMonthlyData = () => {
    if (!invoices) return [];
    const monthlyData: { [key: string]: number } = {};
    
    // Get the last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }
    
    // Summarize invoice amounts by month
    filteredInvoices.forEach(invoice => {
      const date = new Date(invoice.issueDate);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey] += invoice.amount;
      }
    });
    
    // Convert to array for chart
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month: month.split('-')[1],
      year: month.split('-')[0],
      revenue: amount
    }));
  };

  const monthlyData = getMonthlyData();
  
  // Colors for charts
  const COLORS = ['#1976d2', '#43a047', '#ff9800', '#d32f2f', '#6d4c41', '#7e57c2'];

  // Summary metrics
  const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = filteredInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = filteredInvoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const percentPaid = totalRevenue ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  const isLoading = isClientsLoading || isOrdersLoading || isInvoicesLoading;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Financial Reports</h2>
        <div className="w-[200px]">
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Paid Invoices</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Pending Invoices</p>
                <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{formatCurrency(totalPending)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Payment Rate</p>
                <p className="text-2xl font-semibold">{percentPaid}%</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Clients by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Clients by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ordersByClient}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#1976d2" />
                <YAxis yAxisId="right" orientation="right" stroke="#43a047" />
                <Tooltip formatter={(value, name) => {
                  if (name === "revenue") return formatCurrency(value as number);
                  return value;
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#1976d2" />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#43a047" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
