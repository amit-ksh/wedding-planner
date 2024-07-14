import EventsView from "~/components/event/EventsView";

interface EventsProps {
  weddingId: string;
}

export default async function Events({ weddingId }: EventsProps) {
  return <EventsView weddingId={weddingId} />;
}
