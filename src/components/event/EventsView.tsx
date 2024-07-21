"use client";

import type { Event } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EventForm, type TCustomEventFormValidator } from "./EventForm";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Check, CircleCheck, Clock } from "lucide-react";

interface EventsViewProps {
  weddingId: string;
}

export default function EventsView(props: EventsViewProps) {
  const { data: events, refetch: refetchEvent } = api.event.getAll.useQuery(
    { weddingId: props.weddingId },
    { enabled: !!props.weddingId },
  );
  const { mutate: createEvent, status } = api.event.create.useMutation({
    onSuccess: async () => {
      toast({
        title: "New event created!",
      });
      await refetchEvent();
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

      <div className="my-6 ">
        <h3 className="text-center text-2xl">Event Timeline</h3>
      </div>
      <div className="relative mb-6 space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent md:before:mx-auto md:before:translate-x-0">
        {events && events?.length > 0
          ? events.map((event) => {
              const isCompleted = new Date() > new Date(event.date);
              return (
                <div
                  key={event.id}
                  className="group relative flex min-w-40 items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-white text-blue-950 shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {!isCompleted ? <Clock size={24} /> : <Check size={24} />}
                  </div>

                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
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
                        className={buttonVariants({
                          variant: "link",
                          className: "text-white underline",
                        })}
                      >
                        View details & media
                      </Link>
                    </div>
                  </Card>
                </div>
              );
            })
          : null}
      </div>
      {events && events?.length <= 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h2 className="text-2xl">No events are created yet!</h2>
        </div>
      ) : null}
    </>
  );
}
