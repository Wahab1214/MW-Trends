import AdminOrderDetailClient from "./AdminOrderDetailClient";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AdminOrderDetailClient orderId={resolvedParams.id} />;
}
