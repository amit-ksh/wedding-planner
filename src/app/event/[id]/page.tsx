import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import EventDetail from "./EventDetail";
import EventMedia from "./EventMedia";
import { Separator } from "~/components/ui/separator";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: undefined;
}

export default async function page(props: PageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) return redirect("/api/auth/login");

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });
  if (!dbUser)
    return redirect(`/auth-callback?origin=wedding/${props.params.id}`);

  const event = await db.event.findFirst({
    where: {
      id: props.params.id,
      Wedding: {
        userId: user.id,
      },
    },
    include: {
      Media: true,
    },
  });
  if (!event) return redirect(`/dashboard`);

  return (
    <MaxWidthWrapper className="my-4">
      <EventDetail event={event} />
      <Separator className="my-4" />
      <EventMedia eventId={event.id} media={event.Media} />
    </MaxWidthWrapper>
  );
}
