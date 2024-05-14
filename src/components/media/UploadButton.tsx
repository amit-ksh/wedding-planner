"use client";

import {
  CldUploadButton,
  type CloudinaryUploadWidgetInfo,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";

interface UploadButton {
  eventId: string;
}

export default function UploadButton({ eventId }: UploadButton) {
  const { mutate: createMedia, isPending } = api.media.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Media uploaded!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.data?.code.split("_").join(" ") ?? "Error!",
        description: error.message,
      });
    },
  });

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="text-white"
      disabled={isPending}
    >
      <CldUploadButton
        uploadPreset="zhogkbxa"
        onUpload={(res: CloudinaryUploadWidgetResults) => {
          const info = res?.info as CloudinaryUploadWidgetInfo;
          if (!info) {
            toast({
              variant: "destructive",
              title: "Unable to upload media. Please try again!",
            });
          }

          const publicId = info.public_id;
          const type = info.resource_type;

          if (!publicId || !type) {
            toast({
              variant: "destructive",
              title: "Unable to upload media. Please try again!",
            });
            return;
          }

          createMedia({
            publicId,
            type,
            eventId,
          });
        }}
      >
        <div className="flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </div>
      </CldUploadButton>
    </Button>
  );
}
