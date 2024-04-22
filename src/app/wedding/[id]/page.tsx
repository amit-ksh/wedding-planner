import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "~/server/db";
import Wedding from "./wedding";

interface PageProps {
  params: {
    id: string;
  };
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

  const wedding = await db.wedding.findFirst({
    where: {
      id: props.params.id,
    },
    select: { id: true },
  });
  if (!wedding) return redirect(`/dashboard`);

  return (
    <MaxWidthWrapper>
      <Tabs defaultValue="wedding" className="my-4">
        <TabsList className="w-full">
          <TabsTrigger value="wedding" className="w-full">
            Wedding
          </TabsTrigger>
          <TabsTrigger value="venue" className="w-full">
            Venue
          </TabsTrigger>
          <TabsTrigger value="events" className="w-full">
            Events
          </TabsTrigger>
          <TabsTrigger value="guests" className="w-full">
            Guests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wedding">
          <Wedding weddingId={props.params.id} />
        </TabsContent>
        <TabsContent value="venue">Venue</TabsContent>
        <TabsContent value="events">EVENTS</TabsContent>
        <TabsContent value="guests">GUESTS</TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}