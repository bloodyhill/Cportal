import { pgTable, text, serial, integer, date, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

// Client model
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  agency: text("agency").notNull(),
  position: text("position").notNull(),
  notes: text("notes"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  email: true,
  phone: true,
  agency: true,
  position: true,
  notes: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  tweetUrl: text("tweet_url"),
  status: text("status").notNull().default("pending"),
  value: real("value").notNull().default(0),
  orderDate: date("order_date").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  clientId: true,
  title: true,
  description: true,
  tweetUrl: true,
  status: true,
  value: true,
  orderDate: true,
});

// Invoice model
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("pending"),
  dueDate: date("due_date").notNull(),
  issueDate: date("issue_date").notNull(),
  notes: text("notes"),
  pdfPath: text("pdf_path"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  orderId: true,
  invoiceNumber: true,
  amount: true,
  status: true,
  dueDate: true,
  issueDate: true,
  notes: true,
  pdfPath: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// Extended schemas with validations for forms
export const clientFormSchema = insertClientSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  agency: z.string().min(2, "Agency must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
});

export const orderFormSchema = insertOrderSchema.extend({
  clientId: z.number().min(1, "Client is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  value: z.number().min(0, "Value must be a positive number"),
  orderDate: z.date(),
});

export const invoiceFormSchema = insertInvoiceSchema.extend({
  orderId: z.number().min(1, "Order is required"),
  invoiceNumber: z.string().min(2, "Invoice number is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  issueDate: z.date(),
  dueDate: z.date(),
});

export const userFormSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});
