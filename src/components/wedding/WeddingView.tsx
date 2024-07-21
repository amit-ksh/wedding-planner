"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "~/components/ui/use-toast";
import WeddingForm, {
  type TCustomWeddingFormValidator,
} from "~/components/wedding/WeddingForm";
import { api } from "~/trpc/react";

interface WeddingViewProps {
  weddingId: string;
}

export default function WeddingView({ weddingId }: WeddingViewProps) {
  const { data: wedding, refetch: refetchWedding } = api.wedding.get.useQuery({
    id: weddingId,
  });
  const { mutate: updateWedding, status } = api.wedding.update.useMutation({
    onSuccess: async () => {
      toast({
        title: "Wedding details updated successfully!",
      });
      await refetchWedding();
    },
    onError: () => {
      toast({
        title:
          "Error while updating the wedding details. Please try again later!",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit(data: TCustomWeddingFormValidator) {
    const [hours, minutes] = data.time.split(":");
    data.date.setHours(Number(hours));
    data.date.setMinutes(Number(minutes));

    const payload: Parameters<typeof updateWedding>["0"] = {
      id: weddingId,
      title: data.title,
      description: data.description,
      brideName: data.brideName,
      groomName: data.groomName,
      date: data.date,
    };
    updateWedding(payload);
  }

  if (!wedding) {
    return (
      <div className="flex h-[40vh] items-center justify-center gap-4">
        <Loader className="h-6 w-6 animate-spin" />
        <p>Loading wedding data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <WeddingForm
        onSubmit={handleFormSubmit}
        defaultValues={{ ...wedding, time: format(wedding?.date, "kk:mm") }}
        disabled={status == "pending"}
        formTitle="Wedding"
        formDescription="Manage the wedding details from here."
        submitButtonLabel="Save changes"
      />
      <DeleteWeddingForm id={weddingId} title={wedding?.title} />
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
import { format } from "date-fns";

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
    <Card id="delete" className="border !bg-purple-700/50">
      <CardHeader>
        <CardTitle className="font-sans font-medium text-destructive">
          Delete Wedding
        </CardTitle>
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
