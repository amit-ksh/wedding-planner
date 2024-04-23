"use client";

import { useRouter } from "next/navigation";

import { toast } from "~/components/ui/use-toast";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { api } from "~/trpc/react";

import WeddingForm, {
  type TCustomFormValidator,
} from "~/components/wedding/WeddingForm";

export default function CreateWedding() {
  const router = useRouter();

  const { mutate: createWedding, status } = api.wedding.create.useMutation({
    onSuccess: (newWedding) => {
      toast({
        title: "New wedding created!",
      });
      router.push(`/wedding/${newWedding.id}`);
    },
    onError: () => {
      toast({
        title: "Error while creating the wedding. Please try again later!",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit(data: TCustomFormValidator) {
    const [hours, minutes] = data.time.split(":");
    data.date.setHours(Number(hours));
    data.date.setMinutes(Number(minutes));

    const payload: Omit<TCustomFormValidator, "time"> = {
      title: data.title,
      description: data.description,
      brideName: data.brideName,
      groomName: data.groomName,
      date: data.date,
    };
    createWedding(payload);
  }

  return (
    <MaxWidthWrapper>
      <WeddingForm
        onSubmit={handleFormSubmit}
        defaultValues={{ time: "12:00" }}
        className="border-0"
        disabled={status == "pending"}
        formTitle="Create Wedding"
        submitButtonLabel="Create"
      />
    </MaxWidthWrapper>
  );
}
