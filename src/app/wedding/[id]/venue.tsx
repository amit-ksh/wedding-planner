import VenueView from "~/components/venue/VenueView";
import { api } from "~/trpc/server";

interface VenueProps {
  weddingId: string;
}

export default async function Venue(props: VenueProps) {
  const venue = await api.venue.getWeddingVenue({ weddingId: props.weddingId });

  console.log(venue);

  return <VenueView venue={venue} weddingId={props.weddingId} />;
}
