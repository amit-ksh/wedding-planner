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
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

const CustomAddGuestFormValidator = z.object({
  guests: z.array(
    z.object({
      name: z
        .string()
        .min(4, { message: "Title should be min of 4 letters." })
        .max(24, "Title shouldn't be greater than 24 letters."),
      email: z.string().email(),
    }),
  ),
});

export type TCustomAddGuestFormValidator = z.infer<
  typeof CustomAddGuestFormValidator
>;

interface AddGuestFormProps {
  onSubmit: (data: TCustomAddGuestFormValidator) => void;
  disabled?: boolean;
  formTitle: string;
  formDescription?: string;
  submitButtonLabel: string;
  children: ReactNode;
  className?: string;
}

export function AddGuestForm({
  onSubmit,
  className,
  disabled,
  formTitle,
  formDescription,
  submitButtonLabel,
  children,
}: AddGuestFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<TCustomAddGuestFormValidator>({
    resolver: zodResolver(CustomAddGuestFormValidator),
    defaultValues: {
      guests: [{ email: "", name: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  function handleSubmit(data: TCustomAddGuestFormValidator) {
    onSubmit(data);
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={cn("text-color-white", className)}
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-purple-800/70 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          {!!formDescription && (
            <DialogDescription>{formDescription}</DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form id="add-guest-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-7 gap-2">
                  <FormField
                    {...form.register(`guests.${index}.name`)}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormControl>
                          <Input placeholder="Guest Name" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    {...form.register(`guests.${index}.email`)}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormControl>
                          <Input
                            placeholder="Guest Emails"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="col-span-1 font-semibold text-red-600"
                    onClick={() => remove(index)}
                  >
                    <MinusCircleIcon className="h-4 w-4" />{" "}
                  </Button>
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="flex gap-2 hover:bg-purple-500"
                onClick={() => append({ name: "", email: "" })}
              >
                Add new guest <PlusCircleIcon />
              </Button>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            type="submit"
            form="add-guest-form"
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
