import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import DatePicker from "~/components/ui/datepicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

export type TCustomFormValidator = z.infer<typeof CustomFormValidator>;

interface FormProps {
  onSubmit: (data: TCustomFormValidator) => void;
  defaultValues?: Partial<TCustomFormValidator>;
  disabled?: boolean;
  formTitle: string;
  formDescription?: string;
  submitButtonLabel: string;
  className?: string;
}

export default function WeddingForm({
  onSubmit,
  defaultValues,
  className,
  disabled,
  formTitle,
  formDescription,
  submitButtonLabel,
}: FormProps) {
  const form = useForm<TCustomFormValidator>({
    resolver: zodResolver(CustomFormValidator),
    defaultValues,
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        {formDescription ? (
          <CardDescription>{formDescription}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="create-wedding-form" onSubmit={form.handleSubmit(onSubmit)}>
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
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          className="flex items-center gap-2 text-white"
          form="create-wedding-form"
          disabled={disabled}
        >
          {disabled ? <Loader className="h-4 w-4 animate-spin" /> : null}
          {submitButtonLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
