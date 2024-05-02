"use client";

import type { Guest } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  AddGuestForm,
  type TCustomAddGuestFormValidator,
} from "./AddGuestForm";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface GuestsViewProps {
  guests: {
    unsentGuestEmails: Guest[];
    sentGuestEmails: Guest[];
  };
  weddingId: string;
}

export default function GuestsView({ guests, weddingId }: GuestsViewProps) {
  const { mutate: addGuests, status: addingGuestsStatus } =
    api.guest.add.useMutation();
  const { mutate: sendMails, status: sendingMailsStatus } =
    api.guest.sendMails.useMutation({
      onSuccess: (data) => {
        toast({
          title: "SUCCESS",
          description: data.message,
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: err.data?.code,
          description: err.message,
        });
      },
    });

  function handleAddNewGuests(data: TCustomAddGuestFormValidator) {
    addGuests({
      ...data,
      weddingId,
    });
  }

  function handleSendMails() {
    sendMails({
      weddingId,
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="">
          <CardTitle>Guests</CardTitle>
          <CardDescription>Manage your guests from here.</CardDescription>
        </div>

        <AddGuestForm
          formTitle="Add Guest"
          submitButtonLabel="Add"
          disabled={addingGuestsStatus == "pending"}
          onSubmit={handleAddNewGuests}
        >
          Add Guest
        </AddGuestForm>
      </CardHeader>

      <CardContent className="mx-2 space-y-8">
        <div className="">
          <div className="">
            <h3 className="mb-3 mr-2 inline-block border-b text-lg font-semibold">
              Guests who don&apos;t received invitation yet.
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-white"
              onClick={handleSendMails}
              disabled={
                guests.unsentGuestEmails.length == 0 ||
                sendingMailsStatus == "pending"
              }
            >
              Send Mails to Guests
            </Button>
          </div>
          <ul className="">
            <li className="grid grid-cols-3 border-b py-1 font-semibold">
              <p>Guest&apos;s Name</p>
              <p>Guest&apos;s Email</p>
              <p>Added At</p>
            </li>
            {guests.unsentGuestEmails.length > 0 ? (
              guests.unsentGuestEmails.map((guest) => (
                <li key={guest.id} className="grid grid-cols-3 border-b py-1">
                  <p>{guest.name}</p>
                  <p>{guest.email}</p>
                  <p>{format(guest.createdAt, "PPpp")}</p>
                </li>
              ))
            ) : (
              <li className="my-4 text-center text-lg font-medium">
                No new guests added
              </li>
            )}
          </ul>
        </div>

        <div className="">
          <h3 className="mb-3 inline-block border-b text-lg font-semibold">
            Guests who received invitation.
          </h3>
          <ul className="">
            <li className="grid grid-cols-3 border-b py-1 font-semibold">
              <p>Guest&apos;s Name</p>
              <p>Guest&apos;s Email</p>
              <p>Mail Sent At</p>
            </li>
            {guests.sentGuestEmails.length > 0 ? (
              guests.sentGuestEmails.map((guest) => (
                <li key={guest.id} className="grid grid-cols-3 border-b py-1">
                  <p>{guest.name}</p>
                  <p>{guest.email}</p>
                  <p>{format(guest.createdAt, "PPpp")}</p>
                </li>
              ))
            ) : (
              <li className="my-4 text-center text-lg font-medium">
                0 mails sent to the guests
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
