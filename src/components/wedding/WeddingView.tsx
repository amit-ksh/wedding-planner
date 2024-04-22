"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "~/components/ui/use-toast";
import WeddingForm, {
  type TCustomFormValidator,
} from "~/components/wedding/Form";

import { api } from "~/trpc/react";

interface WeddingViewProps {
  wedding: TCustomFormValidator & { id: string };
}

export default function WeddingView({ wedding }: WeddingViewProps) {
  const { mutate: updateWedding, status } = api.wedding.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Wedding details updated successfully!",
      });
    },
    onError: () => {
      toast({
        title:
          "Error while updating the wedding details. Please try again later!",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit(data: TCustomFormValidator) {
    const [hours, minutes] = data.time.split(":");
    data.date.setHours(Number(hours));
    data.date.setMinutes(Number(minutes));

    const payload: Omit<TCustomFormValidator, "time"> & { id: string } = {
      id: wedding.id,
      title: data.title,
      description: data.description,
      brideName: data.brideName,
      groomName: data.groomName,
      date: data.date,
    };
    updateWedding(payload);
  }
  return (
    <div className="space-y-5">
      <WeddingForm
        onSubmit={handleFormSubmit}
        defaultValues={wedding}
        disabled={status == "pending"}
        formTitle="Wedding"
        formDescription="Manage the wedding details from here."
        submitButtonLabel="Save changes"
      />
      <DeleteWeddingForm id={wedding.id} title={wedding.title} />
    </div>
  );
}

import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function DeleteWeddingForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const router = useRouter();

  const { mutate: deleteWedding, status } = api.wedding.delete.useMutation({
    onSuccess() {
      toast({
        title: "Wedding deleted successfully",
      });
      router.push("/dashboard");
    },
    onError() {
      toast({
        title: "Error while deleting wedding. Please try again later!",
      });
    },
  });

  return (
    <Card id="delete">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Wedding</CardTitle>
        <CardDescription>
          Be cautious, once deleted, it cannot be restored.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="delete-wedding-form" onSubmit={() => deleteWedding({ id })}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">
                Type{" "}
                <Badge
                  variant="secondary"
                  className="font-md rounded-sm tracking-wider"
                >
                  {title}
                </Badge>{" "}
                to confirm the delete.
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Write the title of wedding to confirm deletion"
                onChange={(e) => setConfirmationInput(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          variant="destructive"
          form="delete-wedding-form"
          disabled={confirmationInput != title || status == "pending"}
        >
          {status == "pending" ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
