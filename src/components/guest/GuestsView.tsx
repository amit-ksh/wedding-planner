"use client";

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
import { Loader, Trash2 } from "lucide-react";

interface GuestsViewProps {
  weddingId: string;
}

export default function GuestsView({ weddingId }: GuestsViewProps) {
  const { data: guests, refetch: refetchGuest } =
    api.guest.getGuestByStatus.useQuery(
      { weddingId },
      { enabled: !!weddingId },
    );
  const { mutate: addGuests, status: addingGuestsStatus } =
    api.guest.add.useMutation({
      onSuccess: async (data) => {
        toast({
          title: "SUCCESS",
          description: data.message,
        });
        await refetchGuest();
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: err.data?.code,
          description: err.message,
        });
      },
    });
  const { mutate: sendMails, status: sendingMailsStatus } =
    api.guest.sendMails.useMutation({
      onSuccess: async (data) => {
        toast({
          title: "SUCCESS",
          description: data.message,
        });
        await refetchGuest();
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: err.data?.code,
          description: err.message,
        });
      },
    });

  const { mutate: removeGuest } = api.guest.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "SUCCESS",
        description: "Guest removed from the list.",
      });
      await refetchGuest();
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
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                (guests && guests?.unsentGuestEmails.length == 0) ||
                sendingMailsStatus == "pending"
              }
            >
              <div className="flex flex-row items-center gap-2">
                {sendingMailsStatus == "pending" && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}
                Send Mails to Guests
              </div>
            </Button>
          </div>
          <ul className="">
            <li className="grid grid-cols-4 border-b py-1 font-semibold">
              <p>Guest&apos;s Name</p>
              <p>Guest&apos;s Email</p>
              <p>Added At</p>
            </li>
            {guests && guests.unsentGuestEmails.length > 0 ? (
              guests.unsentGuestEmails.map((guest) => (
                <li key={guest.id} className="grid grid-cols-4 border-b py-1">
                  <p>{guest.name}</p>
                  <p>{guest.email}</p>
                  <p>{format(guest.createdAt, "PPpp")}</p>
                  <div className="mx-4 flex justify-end">
                    <button
                      className="h-4 w-4 text-red-500 hover:text-red-600"
                      onClick={() => removeGuest({ id: guest.id })}
                    >
                      <Trash2 className="h-full w-full" />
                    </button>
                  </div>
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
            {guests && guests.sentGuestEmails.length > 0 ? (
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
