"use client";

import type { Media } from "@prisma/client";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import UploadButton from "~/components/media/UploadButton";

import "next-cloudinary/dist/cld-video-player.css";
import { Button } from "~/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";
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
  const { refetch: refetchEvent } = api.event.get.useQuery({
    id: eventId,
  });
  const { mutate: deleteMedia } = api.media.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Media deleted!",
      });
      await refetchEvent();
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
        {media.length > 0 &&
          media.map((m) => (
            <div key={m.id} className="relative rounded-md bg-blue-500/20 p-2">
              {m.type == "image" ? (
                <CldImage
                  id={m.id}
                  width={1200}
                  height={720}
                  src={m.publicId}
                  alt={m.type as string}
                  flags={"attachment"}
                  className="!h-full !w-full overflow-hidden rounded-sm"
                />
              ) : (
                <CldVideoPlayer
                  id={m.id}
                  src={m.publicId}
                  width={1200}
                  height={720}
                  bigPlayButton={true}
                  className="!h-full !w-full overflow-hidden rounded-sm"
                />
              )}

              <div className="absolute right-3 top-3 z-10">
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
                        This action cannot be undone. This will permanently
                        delete this {m.type} from our servers.
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
        {media.length <= 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center gap-4 rounded-md text-xl font-semibold text-muted-foreground">
            <ImageIcon className="h-12 w-12" />
            <p>No media uploaded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
