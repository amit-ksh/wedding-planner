import EventsView from "~/components/event/EventsView";
import { api } from "~/trpc/server";

interface EventsProps {
  weddingId: string;
}

export default async function Event({ weddingId }: EventsProps) {
  const events = await api.event.getAll({ weddingId });

  return <EventsView events={events} weddingId={weddingId} />;
}
