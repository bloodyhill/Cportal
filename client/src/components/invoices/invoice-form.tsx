import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type Invoice, invoiceFormSchema, type InsertInvoice, type Order } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  isEdit?: boolean;
}

export function InvoiceForm({ open, onOpenChange, invoice, isEdit = false }: InvoiceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const form = useForm<InsertInvoice>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      orderId: invoice?.orderId || 0,
      invoiceNumber: invoice?.invoiceNumber || "",
      amount: invoice?.amount || 0,
      status: invoice?.status || "pending",
      dueDate: invoice ? new Date(invoice.dueDate) : new Date(),
      issueDate: invoice ? new Date(invoice.issueDate) : new Date(),
      notes: invoice?.notes || "",
      pdfPath: invoice?.pdfPath || "",
    },
  });

  async function onSubmit(data: InsertInvoice) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      console.log("Original invoice data:", data);
      
      // Ensure dates are properly formatted as strings for API submission
      const processedData = {
        ...data,
        dueDate: data.dueDate instanceof Date 
          ? data.dueDate.toISOString().split('T')[0] 
          : typeof data.dueDate === 'string' 
            ? data.dueDate 
            : new Date().toISOString().split('T')[0],
        issueDate: data.issueDate instanceof Date 
          ? data.issueDate.toISOString().split('T')[0] 
          : typeof data.issueDate === 'string' 
            ? data.issueDate 
            : new Date().toISOString().split('T')[0],
        notes: data.notes || "",
        pdfPath: data.pdfPath || "",
      };
      
      console.log("Processed invoice data:", processedData);
      
      // Add form data
      Object.entries(processedData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add file if present
      if (file) {
        formData.append('pdf', file);
      }

      let response;
      if (isEdit && invoice) {
        response = await fetch(`/api/invoices/${invoice.id}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Error updating invoice: ${response.statusText}`);
        }
        
        toast({
          title: "Invoice updated",
          description: "Invoice has been updated successfully",
        });
      } else {
        response = await fetch('/api/invoices', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Error creating invoice: ${response.statusText}`);
        }
        
        toast({
          title: "Invoice created",
          description: "New invoice has been created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      onOpenChange(false);
      form.reset();
      setFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const getOrderTitle = (orderId: number) => {
    const order = orders?.find(o => o.id === orderId);
    return order ? order.title : "Unknown Order";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <span className="material-icons text-primary-dark dark:text-primary-light">
                  {isEdit ? "edit" : "receipt"}
                </span>
              </div>
              <div>{isEdit ? "Edit Invoice" : "Create New Invoice"}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders?.map((order) => (
                        <SelectItem key={order.id} value={order.id.toString()}>
                          {order.title} - {new Date(order.orderDate).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. INV-2023-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g. 1500.00" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          field.onChange(new Date(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          field.onChange(new Date(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes about the invoice..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel htmlFor="invoicePdf">Invoice PDF (Optional)</FormLabel>
              <Input
                id="invoicePdf"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-1"
              />
              {invoice?.pdfPath && !file && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Current file: {invoice.pdfPath.split('/').pop()}
                </p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                    {isEdit ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  isEdit ? "Update Invoice" : "Create Invoice"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
