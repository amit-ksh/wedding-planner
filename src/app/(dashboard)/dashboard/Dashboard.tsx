import Link from "next/link";
import { Calendar, GhostIcon, MapPin, Trash2Icon } from "lucide-react";
import { format } from "date-fns";

import { buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/server";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import Image from "next/image";

async function Dashboard() {
  const weddings = await api.wedding.getAll();

  return (
    <main>
      <MaxWidthWrapper className="mx-auto max-w-7xl px-3">
        <div>
          <Image
            src="/groom-bride.svg"
            alt="groom bride wedding photo"
            width={500}
            height={500}
            className="fixed -bottom-16 -right-8 z-50 opacity-20"
            aria-hidden
          />
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="text-3xl">Dashboard</h1>
          <Link
            href="/wedding/create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-purple-400 bg-purple-800 text-white hover:bg-purple-700",
            })}
          >
            Create Wedding
          </Link>
        </div>

        {weddings && weddings?.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weddings
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((wedding) => (
                <li
                  key={wedding.id}
                  className="col-span-1 rounded-md border border-purple-400 bg-purple-800 text-card-foreground shadow transition hover:shadow-lg"
                >
                  <div className="flex  justify-between">
                    <Link
                      href={`/wedding/${wedding.id}`}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                        <div className="flex-1 truncate ">
                          <div className="flex flex-col items-start justify-start">
                            <h3 className="truncate font-mono text-lg">
                              {wedding.title}
                            </h3>
                            <p className="font-xs truncate font-thin">
                              {wedding.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/wedding/${wedding.id}#delete`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                        className:
                          "border-0 bg-transparent hover:bg-transparent",
                      })}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-600 hover:text-red-500" />
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center gap-6 border-t  px-6 py-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {wedding?.date
                        ? format(new Date(wedding.date), "dd-MMM-yyyy")
                        : "Yet To Scheduled"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {wedding?.Venue?.name
                        ? wedding.Venue.name
                        : "Not Decided"}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <GhostIcon className="h-8 w-8 " />
            <h3 className="text-xl font-semibold">Pretty empty around here.</h3>
            <p>Create a wedding to manage.</p>
          </div>
        )}
      </MaxWidthWrapper>
    </main>
  );
}

export default Dashboard;
