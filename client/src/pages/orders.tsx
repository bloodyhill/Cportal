import { OrderList } from "@/components/orders/order-list";

export default function Orders() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-6 md:hidden">Orders</h2>
      <OrderList />
    </div>
  );
}
