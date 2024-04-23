import { api } from "~/trpc/server";
import WeddingView from "~/components/wedding/WeddingView";

interface WeddingViewProps {
  weddingId: string;
}

export default async function Wedding({ weddingId }: WeddingViewProps) {
  const wedding = await api.wedding.get({ id: weddingId });

  return <WeddingView wedding={wedding} />;
}
