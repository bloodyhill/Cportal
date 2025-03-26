import { useQuery } from "@tanstack/react-query";
import { type Client } from "@shared/schema";

export function useClientName() {
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  return (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };
}
