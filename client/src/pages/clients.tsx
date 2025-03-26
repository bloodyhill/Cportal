import { ClientList } from "@/components/clients/client-list";

export default function Clients() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-6 md:hidden">Clients</h2>
      <ClientList />
    </div>
  );
}
