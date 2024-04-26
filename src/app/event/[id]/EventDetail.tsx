"use client";

import type { Event } from "@prisma/client";
import { format } from "date-fns";
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
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface EventProps {
  event: Event;
}

export default function EventDetails({ event }: EventProps) {
  const router = useRouter();
  const { mutate: updateEvent, status } = api.event.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Event updated!",
      });
      router.push(`/wedding/${event.weddingId}`);
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
      id: event.id,
      name: data.name,
      description: data.description,
      date: data.date,
    };
    updateEvent(payload);
  }

  return (
    <Card key={event.id}>
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
  );
}
