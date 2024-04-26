"use client";

import type { Media } from "@prisma/client";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import UploadButton from "~/components/media/UploadButton";

import "next-cloudinary/dist/cld-video-player.css";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useState } from "react";

interface EventMediaProps {
  media: Media[];
  eventId: string;
}

export default function EventMedia({ media, eventId }: EventMediaProps) {
  const { mutate: deleteMedia } = api.media.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Media deleted!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.data?.code.split("_").join(" ") ?? "Error!",
        description: error.message,
      });
    },
    onSettled: (_data, _err, input) => {
      // remove the loading list
      setIds((arr) => [...arr.filter((id) => id !== input.id)]);
    },
  });
  const [ids, setIds] = useState<string[]>([]);

  function handleDeleteMedia(id: string) {
    deleteMedia({ id });
    setIds([...ids, id]);
  }

  return (
    <section>
      <div className="flex items-center gap-4">
        <h3 className="text-2xl">Media</h3>
        <UploadButton eventId={eventId} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((m) => (
          <div key={m.id} className="relative rounded-md bg-blue-500/20 p-1">
            {m.type == "image" ? (
              <CldImage
                id={m.id}
                width="400"
                height="300"
                src={m.publicId}
                alt={m.type as string}
                flags={"attachment"}
                className="!h-full !w-full"
              />
            ) : (
              <CldVideoPlayer
                id={m.id}
                src={m.publicId}
                width="400"
                height="300"
                bigPlayButton={true}
                className="!h-full !w-full"
              />
            )}

            <div className="absolute right-2 top-2 z-10">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={!!ids.find((cur) => cur === m.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this {m.type} from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteMedia(m.id)}
                      className="focus-visible::bg-red-950 bg-red-900 text-white hover:bg-red-950 "
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
