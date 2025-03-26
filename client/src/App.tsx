import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./context/auth-context";
import { LanguageProvider } from "./context/language-context";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Pages
import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import Orders from "@/pages/orders";
import Invoices from "@/pages/invoices";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

// Layout components
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";

function Router() {
  const [currentPage, setCurrentPage] = useState<string>("Dashboard");
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header currentPage={currentPage} />
        <main className="flex-1 pb-16 md:pb-0">
          <Switch>
            <Route path="/" component={() => {
              setCurrentPage("Dashboard");
              return (
                <ProtectedRoute requiredPermission="view_dashboard">
                  <Dashboard />
                </ProtectedRoute>
              );
            }} />
            <Route path="/clients" component={() => {
              setCurrentPage("Clients");
              return (
                <ProtectedRoute requiredPermission="view_clients">
                  <Clients />
                </ProtectedRoute>
              );
            }} />
            <Route path="/orders" component={() => {
              setCurrentPage("Orders");
              return (
                <ProtectedRoute requiredPermission="view_orders">
                  <Orders />
                </ProtectedRoute>
              );
            }} />
            <Route path="/invoices" component={() => {
              setCurrentPage("Invoices");
              return (
                <ProtectedRoute requiredPermission="view_invoices">
                  <Invoices />
                </ProtectedRoute>
              );
            }} />
            <Route path="/reports" component={() => {
              setCurrentPage("Reports");
              return (
                <ProtectedRoute requiredPermission="view_reports">
                  <Reports />
                </ProtectedRoute>
              );
            }} />
            <Route path="/settings" component={() => {
              setCurrentPage("Settings");
              return (
                <ProtectedRoute requiredPermission="view_settings">
                  <Settings />
                </ProtectedRoute>
              );
            }} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
