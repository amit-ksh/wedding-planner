import { format } from "date-fns";

interface GuestInvitationEmailTemplateProps {
  brideName: string;
  groomName: string;
  date: string;
}

export default function GuestInvitationEmailTemplate(
  props: GuestInvitationEmailTemplateProps,
) {
  return (
    <html>
      <body>
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dzcf9eqz7/image/upload/v1714396732/wedding-planner/jaangstvrj4wama5s5ig.jpg"
            width="3333"
            height="4000"
            alt="beautiful background image with some flowers"
            className="bg-image"
            aria-hidden
          />

          <div className="content-wrapper">
            <div className="content-container">
              <p className="">
                Be Out Guest <br /> we expect your presence at <br /> our
                wedding
              </p>
              <h1 className="font-sans text-3xl font-normal capitalize text-yellow-500 lg:text-5xl">
                {props.groomName} <br /> & <br /> {props.brideName}
              </h1>
              <div className="save-date-container">
                <p className="">Save the date</p>
                <p className="font-serif ">
                  {format(props.date, "EEEE, MMMM do")} <br />{" "}
                  {format(props.date, "yyyy")} | {format(props.date, "p")}
                </p>
              </div>

              <div className="location-container">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 395.71 395.71"
                  xmlSpace="preserve"
                  aria-label="Location Icon"
                  className="location-icon"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
                <p>India</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
