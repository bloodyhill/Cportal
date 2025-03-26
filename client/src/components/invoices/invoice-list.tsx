import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Invoice, type Order } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceForm } from "./invoice-form";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "../../lib/utils";
import { useClientName } from "../../hooks/use-client-name";

export function InvoiceList() {
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const getClientName = useClientName();

  const getOrderTitle = (orderId: number) => {
    const order = orders?.find(o => o.id === orderId);
    return order ? order.title : "Unknown Order";
  };

  const getOrderClientId = (orderId: number) => {
    const order = orders?.find(o => o.id === orderId);
    return order ? order.clientId : 0;
  };

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOrderTitle(invoice.orderId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(getOrderClientId(invoice.orderId)).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredInvoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const paidAmount = filteredInvoices?.filter(invoice => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const pendingAmount = filteredInvoices?.filter(invoice => invoice.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0) || 0;

  const handleAddNewClick = () => {
    setSelectedInvoice(undefined);
    setIsEditMode(false);
    setInvoiceFormOpen(true);
  };

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setInvoiceFormOpen(true);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleViewPdf = (pdfPath: string) => {
    if (pdfPath) {
      window.open(pdfPath, '_blank');
    } else {
      toast({
        title: "No PDF available",
        description: "This invoice doesn't have an attached PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    
    try {
      await apiRequest("DELETE", `/api/invoices/${invoiceToDelete.id}`, undefined);
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Invoice deleted",
        description: "Invoice has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "canceled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <span className="material-icons absolute left-3 top-2 text-neutral-400 dark:text-neutral-500">search</span>
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center flex-wrap justify-between md:justify-end gap-2 space-x-4">
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total</p>
              <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-200">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-green-600 dark:text-green-400">Paid</p>
              <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-200">
                {formatCurrency(paidAmount)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-200">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
            
            <Button onClick={handleAddNewClick} className="flex items-center">
              <span className="material-icons mr-1">add</span> New Invoice
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Order & Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Skeleton className="h-5 w-24 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredInvoices && filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-neutral-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                          {invoice.invoiceNumber}
                        </div>
                        {invoice.pdfPath && (
                          <button 
                            onClick={() => handleViewPdf(invoice.pdfPath || "")}
                            className="text-xs text-primary-dark dark:text-primary-light hover:underline flex items-center"
                          >
                            <span className="material-icons text-sm mr-1">description</span>
                            View PDF
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                          {getOrderTitle(invoice.orderId)}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {getClientName(getOrderClientId(invoice.orderId))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-600 dark:text-neutral-200">
                          Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                          {formatCurrency(invoice.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(invoice)}
                          className="text-primary-dark dark:text-primary-light hover:text-primary mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(invoice)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                      {searchQuery || statusFilter !== "all" 
                        ? "No invoices found matching your filters." 
                        : "No invoices found. Create your first invoice to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InvoiceForm 
        open={invoiceFormOpen} 
        onOpenChange={setInvoiceFormOpen} 
        invoice={selectedInvoice} 
        isEdit={isEditMode} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice "{invoiceToDelete?.invoiceNumber}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
