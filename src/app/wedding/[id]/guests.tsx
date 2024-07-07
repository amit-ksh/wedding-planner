import GuestsView from "~/components/guest/GuestsView";

interface GuestsProps {
  weddingId: string;
}

export default async function Guests({ weddingId }: GuestsProps) {
  return <GuestsView weddingId={weddingId} />;
}
