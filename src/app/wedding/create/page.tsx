"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import DatePicker from "~/components/ui/datepicker";

export default function CreateWedding() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { mutate: createWedding } = api.wedding.create.useMutation({
    onSuccess: (newWedding) => {
      toast({
        title: "New wedding created!",
      });
      setLoading(false);
      router.push(`/wedding/${newWedding.id}`);
    },
    onError: (err) => {
      toast({
        title: "Error while creating the wedding. Please try again later!",
        variant: "destructive",
      });
    },
  });

  const CustomFormValidator = z.object({
    title: z
      .string()
      .min(4, { message: "Title should be min of 4 letters." })
      .max(24, "Title shouldn't be greater than 24 letters."),
    description: z.string(),
    groomName: z.string(),
    brideName: z.string(),
    date: z.date(),
    time: z.string(),
  });

  type TCustomFormValidator = z.infer<typeof CustomFormValidator>;

  const form = useForm<TCustomFormValidator>({
    resolver: zodResolver(CustomFormValidator),
    defaultValues: {
      time: "12:00",
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
    setLoading(true);
    createWedding(payload);
  }

  return (
    <MaxWidthWrapper>
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Create Wedding</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="create-wedding-form"
              onSubmit={form.handleSubmit(handleFormSubmit)}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Wedding Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={100}
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full items-baseline gap-2 space-y-4 sm:flex sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 sm:w-1/2">
                        <FormLabel>Wedding Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          label="Select wedding date"
                          onDateSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>Wedding Time (24hrs clock)</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="Wedding Time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="groomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groom Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Groom Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brideName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bride Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Bride Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            className="flex items-center gap-2 text-white"
            form="create-wedding-form"
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : null}
            CREATE
          </Button>
        </CardFooter>
      </Card>
    </MaxWidthWrapper>
  );
}
