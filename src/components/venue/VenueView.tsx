"use client";

import { type FormEvent } from "react";
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
import venues from "./venues.json";
import Link from "next/link";

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
  const { mutate: bookVenue, status } = api.venue.book.useMutation({
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
  // const {data: venues, isLoading: venuesLoading, isError: getVenuesError} = api.venue.getVenues.useQuery({
  //   query: 'wedding hall or banquet',
  //   country: 'India',
  //   state: 'JH',
  // })

  function handleVenueSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search");
    console.log(search);

    // search for the venues
  }

  function handleVenueBook(venue: Omit<Venue, "id">) {
    bookVenue({
      name: venue.name,
      address: venue.address,
      photos: venue.photos,
      weddingId: props.weddingId,
    });
  }

  return (
    <div className="space-y-4">
      {/* If venue booked then show the booked venue */}
      {props.venue ? (
        <Card>
          <CardHeader>
            <CardTitle>{props.venue.name}</CardTitle>
            <CardDescription>{props.venue.address}</CardDescription>
          </CardHeader>
          <CardContent>{/* Photos */}</CardContent>
        </Card>
      ) : null}

      <div className="rounded-xl border bg-slate-900/40 p-2">
        <form
          id="search-venue-form"
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={handleVenueSearch}
        >
          <Input name="search" placeholder="Search Venue" />
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
              <Card key={venue.fsq_id} className="flex flex-col h-fit">
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
                    <Carousel className="w-[85%] mx-auto">
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
                          <CarouselItem className="font-semibold text-muted-foreground text-center">
                            No photos available.
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {venue.photos.length > 0 ?(<CarouselPrevious />) : null}
                      {venue.photos.length > 0 ?(<CarouselNext />) : null}
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
                            <span>Phone</span>
                            <span className="block text-sm font-medium">
                              {venue.tel}
                            </span>
                          </p>
                        ) : null}
                        {venue.email ? (
                          <p className="leading-tight">
                            Email
                            <span className="block text-sm font-medium">
                              {venue.email}
                            </span>
                          </p>
                        ) : null}
                        {venue.website ? (
                          <p className="leading-tight">
                            Website
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
                  <Button className="ml-auto text-white">Select Venue</Button>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}
