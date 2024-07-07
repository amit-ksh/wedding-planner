"use client";

import { useState, type FormEvent } from "react";
import type { Venue } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import Image from "next/image";
// import venues from "./venues.json";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type Venues = Array<{
  fsq_id: string;
  name: string;
  description?: string;
  rating?: number;
  price: number;
  tel?: string;
  email?: string;
  website?: string;
  verified: boolean;
  photos: Array<{
    id: string;
    prefix: string;
    suffix: string;
    width: number;
    height: number;
    createdAt: string;
  }>;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  location: {
    address?: string;
    country?: string;
    cross_street?: string;
    formatted_address?: string;
    locality?: string;
    postcode?: string;
    region?: string;
  };
}>;

interface VenueViewProps {
  venue: Venue | null;
  weddingId: string;
}

// TOOD: add city, state, country to the search form
// TODO: add a loading state for the venues
// TODO: paginate the venues
// TODO: add a way to book the venue
// TODO: add a way to view the booked venue

export default function VenueView(props: VenueViewProps) {
  const [query, setQuery] = useState<string>("wedding hall or banquet");
  const { mutateAsync: bookVenue, status } = api.venue.book.useMutation({
    onSuccess(data) {
      toast({
        title: data.name + " Venue Booked!",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Error while booking the venue. Please try again",
        description: error.message,
      });
    },
  });
  const {
    data: venues,
    isLoading: venuesLoading,
    isError: getVenuesError,
  } = api.venue.getVenues.useQuery({
    query,
    country: "India",
    state: "JH",
  });

  const {
    data: bookedVenue,
    isLoading: bookedVenueLoading,
    refetch: refetchBookedVenue,
  } = api.venue.getWeddingVenue.useQuery({ weddingId: props.weddingId });

  function handleVenueSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search");
    setQuery(search as string);
  }

  async function handleVenueBook(venue: Omit<Venue, "id">) {
    try {
      await bookVenue({
        name: venue.name,
        address: venue.address,
        photos: venue.photos,
        weddingId: props.weddingId,
      });
      toast({
        title: "Venue Booked!",
        description: venue.name + " has been booked for the wedding",
      });
      await refetchBookedVenue();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error while booking the venue. Please try again",
      });
    }
  }

  return (
    <div className="space-y-4">
      {/* If venue booked then show the booked venue */}
      <Card>
        <CardHeader>
          <CardTitle>Booked Venue</CardTitle>
          <CardDescription>
            {bookedVenue ? (
              <>
                <h3 className="text-xl font-medium">{bookedVenue.name}</h3>
                <p className="font-medium">{bookedVenue.address}</p>
              </>
            ) : (
              <p>No venue booked yet</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="mb-2 text-lg font-medium">Photos</h4>
          <Carousel className="mx-auto w-[90%]">
            <CarouselContent>
              {bookedVenue && bookedVenue.photos.length > 0 ? (
                <>
                  {bookedVenue?.photos.map((photo) => (
                    <CarouselItem key={photo} className="lg:basis-1/2">
                      <Image
                        src={`${photo}`}
                        width={512}
                        height={408}
                        alt={bookedVenue.name}
                        className="aspect-auto rounded-md object-cover"
                      />
                    </CarouselItem>
                  ))}
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              ) : (
                <CarouselItem className="text-center font-semibold text-muted-foreground">
                  <div className="flex h-[315px] flex-col items-center justify-center gap-4">
                    <ImageIcon className="h-12 w-12" />
                    No photos available
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
          </Carousel>
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-slate-900/40 p-2">
        <form
          id="search-venue-form"
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={handleVenueSearch}
        >
          <Input
            name="search"
            placeholder="Search Venue"
            defaultValue={query}
          />
          <Button
            type="submit"
            form="search-venue-form"
            className="rounded-lg text-white"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Display possible venue location */}
      <div className="grid grid-cols-1 gap-4 p-2 lg:grid-cols-2">
        {venues && venues?.length > 0
          ? venues.map((venue) => (
              <Card key={venue.fsq_id} className="flex h-full flex-col">
                <CardHeader className="h-fit">
                  <CardTitle>{venue.name}</CardTitle>
                  <CardDescription className="flex items-center justify-between text-sm font-medium">
                    <p>{venue.location.formatted_address}</p>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${venue.geocodes.main.latitude},${venue.geocodes.main.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-28 rounded-md border-2 p-2 text-center font-semibold text-blue-500 hover:underline focus:underline"
                    >
                      Google map
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* PHOTOS */}
                  <div className="">
                    <h4 className="text-lg font-medium">Photos</h4>
                    <Carousel className="mx-auto w-[85%]">
                      <CarouselContent>
                        {venue.photos.length > 0 ? (
                          venue.photos.map((photo) => (
                            <CarouselItem key={photo.id}>
                              <Image
                                src={`${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`}
                                width={photo.width}
                                height={photo.height}
                                alt={venue.name}
                                className="aspect-auto w-full rounded-md object-cover"
                              />
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem className="text-center font-semibold text-muted-foreground">
                            <div className="flex h-[315px] flex-col items-center justify-center gap-4">
                              <ImageIcon className="h-12 w-12" />
                              No photos available
                            </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {venue.photos.length > 0 ? <CarouselPrevious /> : null}
                      {venue.photos.length > 0 ? <CarouselNext /> : null}
                    </Carousel>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2"></div>
                  </div>
                  {/* CONTACTS */}
                  <div>
                    <h4 className="text-lg font-medium">Contacts</h4>
                    {venue.tel ?? venue.email ?? venue.website ? (
                      <div className="grid grid-cols-2 gap-2">
                        {venue.tel ? (
                          <p className="leading-tight">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="block text-sm font-medium">
                              {venue.tel}
                            </span>
                          </p>
                        ) : null}
                        {venue.email ? (
                          <p className="leading-tight">
                            <span className="text-muted-foreground">Email</span>
                            <span className="block text-sm font-medium">
                              {venue.email}
                            </span>
                          </p>
                        ) : null}
                        {venue.website ? (
                          <p className="leading-tight">
                            <span className="text-muted-foreground">
                              Website
                            </span>
                            <Link
                              href={venue.website}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline focus:underline"
                            >
                              <span className="block text-sm font-medium">
                                {venue.website}
                              </span>
                            </Link>
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="font-semibold text-muted-foreground">
                        No contact information available
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto h-14 border-t py-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default" className="ml-auto text-white">
                        {bookedVenue ? "Change Venue" : "Book Venue"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirm Booking Venue
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to book this venue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleVenueBook({
                              address: venue.location.formatted_address ?? "",
                              name: venue.name,
                              photos:
                                venue.photos.length > 0
                                  ? venue.photos.map(
                                      (p) =>
                                        `${p.prefix}${p.width}x${p.height}${p.suffix}`,
                                    )
                                  : [],
                            })
                          }
                          className="text-white"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}
