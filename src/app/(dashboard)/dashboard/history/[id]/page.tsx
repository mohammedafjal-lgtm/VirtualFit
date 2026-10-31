import { HistoryDetailView } from "@/components/features/history/history-detail-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HistoryDetailView id={id} />;
}