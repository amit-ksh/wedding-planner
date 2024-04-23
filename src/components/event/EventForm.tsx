import { type ReactNode, useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import DatePicker from "../ui/datepicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CustomEventFormValidator = z.object({
  name: z
    .string()
    .min(4, { message: "Title should be min of 4 letters." })
    .max(24, "Title shouldn't be greater than 24 letters."),
  description: z.string(),
  date: z.date(),
  time: z.string(),
});

export type TCustomEventFormValidator = z.infer<
  typeof CustomEventFormValidator
>;

interface EventFormProps {
  onSubmit: (data: TCustomEventFormValidator) => void;
  defaultValues?: Partial<TCustomEventFormValidator>;
  disabled?: boolean;
  formTitle: string;
  formDescription?: string;
  submitButtonLabel: string;
  children: ReactNode;
  className?: string;
}

export function EventForm({
  onSubmit,
  defaultValues,
  className,
  disabled,
  formTitle,
  formDescription,
  submitButtonLabel,
  children,
}: EventFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<TCustomEventFormValidator>({
    resolver: zodResolver(CustomEventFormValidator),
    defaultValues,
  });

  function handleSubmit(data: TCustomEventFormValidator) {
    onSubmit(data);
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          {!!formDescription && (
            <DialogDescription>{formDescription}</DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Name" {...field} />
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
                        placeholder="Event Description"
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
                        label="Select event date"
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
                          placeholder="Event Time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            type="submit"
            form="event-form"
            disabled={disabled}
            className="text-white"
          >
            {submitButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
