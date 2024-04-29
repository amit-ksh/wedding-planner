import GuestsView from "~/components/guest/GuestsView";
import { api } from "~/trpc/server";

interface GuestsProps {
  weddingId: string;
}

export default async function Guests({ weddingId }: GuestsProps) {
  const guests = await api.guest.getGuestByStatus({ weddingId });

  return <GuestsView guests={guests} weddingId={weddingId} />;
}
