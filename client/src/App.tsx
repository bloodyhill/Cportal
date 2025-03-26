import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/auth-context";

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header currentPage={currentPage} />
        <main className="flex-1 pb-16 md:pb-0">
          <Switch>
            <Route path="/" component={() => {
              setCurrentPage("Dashboard");
              return <Dashboard />;
            }} />
            <Route path="/clients" component={() => {
              setCurrentPage("Clients");
              return <Clients />;
            }} />
            <Route path="/orders" component={() => {
              setCurrentPage("Orders");
              return <Orders />;
            }} />
            <Route path="/invoices" component={() => {
              setCurrentPage("Invoices");
              return <Invoices />;
            }} />
            <Route path="/reports" component={() => {
              setCurrentPage("Reports");
              return <Reports />;
            }} />
            <Route path="/settings" component={() => {
              setCurrentPage("Settings");
              return <Settings />;
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
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
