"use client";

import type { Event } from "@prisma/client";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EventForm,
  type TCustomEventFormValidator,
} from "~/components/event/EventForm";
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
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import EventMedia from "./EventMedia";

interface EventProps {
  eventId: Event["id"];
}

export default function EventDetails({ eventId }: EventProps) {
  const router = useRouter();
  const {
    data: event,
    isLoading: isEventLoading,
    refetch: refetchEvent,
  } = api.event.get.useQuery({
    id: eventId,
  });
  const { mutate: updateEvent, status } = api.event.update.useMutation({
    onSuccess: async () => {
      toast({
        title: "Event updated!",
      });
      await refetchEvent();
    },
    onError: () => {
      toast({
        title: "Error while updating the event. Please try again later!",
        variant: "destructive",
      });
    },
  });
  const { mutate: deleteEvent } = api.event.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Event delete!",
      });
      router.push(`/wedding/${event?.weddingId}`);
    },
    onError: () => {
      toast({
        title: "Error while delete the event. Please try again later!",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit(data: TCustomEventFormValidator) {
    const [hours, minutes] = data.time.split(":");
    data.date.setHours(Number(hours));
    data.date.setMinutes(Number(minutes));

    const payload: Parameters<typeof updateEvent>["0"] = {
      id: eventId,
      name: data.name,
      description: data.description,
      date: data.date,
    };
    updateEvent(payload);
  }

  if (isEventLoading || !event) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card key={eventId}>
        <CardHeader className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div className="">
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
            <div className="my-2 flex flex-col">
              <p>Date: {format(event.date, "PP")}</p>
              <p>Time: {format(event.date, "pp")}</p>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-start">
            <EventForm
              defaultValues={{ ...event, time: format(event.date, "kk:mm") }}
              onSubmit={handleFormSubmit}
              disabled={status == "pending"}
              formTitle="Update event"
              submitButtonLabel="Save changes"
            >
              Update Event
            </EventForm>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Event</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this event from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteEvent({ id: event.id })}
                    className="focus-visible::bg-red-950 bg-red-900 text-white hover:bg-red-950 "
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
      </Card>
      <Separator className="my-4" />
      <EventMedia eventId={event.id} media={event.Media} />
    </>
  );
}
