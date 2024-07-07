import WeddingView from "~/components/wedding/WeddingView";

interface WeddingViewProps {
  weddingId: string;
}

export default async function Wedding({ weddingId }: WeddingViewProps) {
  return <WeddingView weddingId={weddingId} />;
}
