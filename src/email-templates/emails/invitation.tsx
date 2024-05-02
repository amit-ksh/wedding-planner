import { format } from "date-fns";
import { Body, Head, Html, Tailwind, Text } from "@react-email/components";

interface GuestInvitationEmailTemplateProps {
  brideName: string;
  groomName: string;
  date: string;
}

export default function GuestInvitationEmailTemplate(
  props: GuestInvitationEmailTemplateProps,
) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <div className="w-full py-12">
            <div className="h-full w-full">
              <div className="m-12 rounded border-2 border-yellow-400 p-4 text-center font-mono text-lg font-semibold uppercase text-zinc-800">
                <Text className="mb-5">
                  Be Out Guest <br /> we expect your presence at <br /> our
                  wedding
                </Text>
                <h1 className="font-sans text-4xl font-normal capitalize text-yellow-500">
                  {props.groomName} <br /> & <br /> {props.brideName}
                </h1>

                <div className="mt-5 font-serif">
                  <h2 className="text-lg font-semibold">Save the date</h2>
                  <Text className="">
                    {format(props.date, "EEEE, MMMM do")} <br />{" "}
                    {format(props.date, "yyyy")} | {format(props.date, "p")}
                  </Text>
                </div>

                <div className="mt-5 font-serif">
                  <h2 className="text-lg font-semibold">Location</h2>
                  <Text>India</Text>
                </div>
              </div>
            </div>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
}
