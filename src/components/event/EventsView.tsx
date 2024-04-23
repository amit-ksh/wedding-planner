"use client";

import type { Event } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EventForm, type TCustomEventFormValidator } from "./EventForm";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EventsViewProps {
  events: Event[];
  weddingId: string;
}

export default function EventsView(props: EventsViewProps) {
  const { mutate: createEvent, status } = api.event.create.useMutation({
    onSuccess: () => {
      toast({
        title: "New event created!",
      });
    },
    onError: () => {
      toast({
        title: "Error while creating event. Please try again later!",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit(data: TCustomEventFormValidator) {
    const [hours, minutes] = data.time.split(":");
    data.date.setHours(Number(hours));
    data.date.setMinutes(Number(minutes));

    const payload: Parameters<typeof createEvent>["0"] = {
      name: data.name,
      description: data.description,
      date: data.date,
      weddingId: props.weddingId,
    };
    createEvent(payload);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row gap-5">
          <div className="w-full">
            <CardTitle>Events</CardTitle>
            <CardDescription>Manage all the events here</CardDescription>
          </div>
          <div className="w-fit">
            <EventForm
              onSubmit={handleFormSubmit}
              disabled={status == "pending"}
              formTitle="Create new event"
              submitButtonLabel="Create"
            >
              Create Event
            </EventForm>
          </div>
        </CardHeader>
      </Card>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {props?.events?.length > 0
          ? props?.events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="">
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <div className="flex flex-col">
                    <p>Date: {format(event.date, "PP")}</p>
                    <p>Time: {format(event.date, "pp")}</p>
                  </div>
                </CardHeader>
                <div className="flex flex-row items-center justify-between border-t">
                  <Link
                    href={`/event/${event.id}`}
                    className={buttonVariants({ variant: "link" })}
                  >
                    View details & media
                  </Link>
                </div>
              </Card>
            ))
          : null}
      </div>
      {props?.events?.length <= 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h2 className="text-2xl">No events are created yet!</h2>
        </div>
      ) : null}
    </>
  );
}
