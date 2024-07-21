import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { buttonVariants } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export default async function Home() {
  return (
    <div className="relative">
      {/* <div className="absolute inset-0 z-10 h-full w-full bg-white/60 blur-sm  " /> */}
      <div className="relative z-20">
        <div className="bg-gradient-to-bl from-slate-900 via-purple-900 to-slate-900">
          <MaxWidthWrapper className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-blue-950/40 px-7 py-2 shadow-md backdrop-blur transition-all ">
              <h1 className="text-xl font-semibold ">Wedding Planner</h1>
            </div>

            <h2 className="max-w-3xl text-4xl font-bold md:text-5xl lg:text-6xl">
              Seamlessly plan your{" "}
              <span className="text-emerald-500">perfect day</span>, with{" "}
              <span className="text-red-500">love</span> in every detail.
            </h2>

            <p className="mt-5 max-w-prose text-black dark:text-white sm:text-lg">
              Our wedding planner app ensures every detail is crafted with love,
              making your special day seamless and unforgettable. Plan
              effortlessly today!
            </p>

            <Link
              className={buttonVariants({
                size: "lg",
                className: "mt-5 font-semibold text-white",
              })}
              href="/dashboard"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </MaxWidthWrapper>
        </div>

        <div className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-900 via-amber-100 to-orange-900">
          <MaxWidthWrapper className="flex flex-col items-center justify-center py-28 text-center">
            <h2 className="mb-12 text-center text-3xl font-bold text-black md:text-4xl">
              Photos
            </h2>

            <Carousel>
              <CarouselContent>
                {new Array(10).fill(null).map((_, i) => (
                  <CarouselItem
                    key={`image-${i}`}
                    className="basis-full lg:basis-1/2"
                  >
                    <Image
                      src={`/weddings/image-${i}.jpg`}
                      width={800}
                      height={600}
                      alt={`Image ${i + 1}`}
                      quality={100}
                      className="h-full w-full rounded-lg object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </MaxWidthWrapper>
        </div>

        <div className="relative bg-gradient-to-bl from-slate-900 via-purple-900 to-slate-900">
          <MaxWidthWrapper className="z-10 flex flex-col items-center justify-center py-28 text-center">
            <h2 className="mb-12 text-center text-xl font-bold md:text-2xl">
              Wedding Planner
            </h2>

            <div className="flex flex-col justify-center gap-16 rounded-lg border-2 border-purple-700 p-6 md:flex-row">
              <div>
                <h3 className="mb-8 font-sans text-lg font-semibold">
                  Contact Us
                </h3>

                <div className="text-left">
                  <p>
                    <strong>Phone:</strong> +91 1234567890
                  </p>
                  <p>
                    <strong>Email:</strong> wedplan@mail.com
                  </p>
                </div>
              </div>
              <div>
                <h3 className="mb-8 font-sans text-lg  font-semibold">
                  Working hour
                </h3>

                <div className="text-left">
                  <p>
                    <strong>Monday - Friday:</strong> 4:00 AM - 8:00 PM
                  </p>
                  <p>
                    <strong>Saturday - Sunday:</strong> 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Social</h3>
                <div className="mt-12 flex space-x-4">
                  <Link
                    href="https://facebook.com"
                    className="text-blue-500 hover:text-blue-600"
                    target="_blank"
                  >
                    <svg
                      fill="currentColor"
                      height="24px"
                      width="24px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-143 145 512 512"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M169.5,357.6l-2.9,38.3h-39.3 v133H77.7v-133H51.2v-38.3h26.5v-25.7c0-11.3,0.3-28.8,8.5-39.7c8.7-11.5,20.6-19.3,41.1-19.3c33.4,0,47.4,4.8,47.4,4.8l-6.6,39.2 c0,0-11-3.2-21.3-3.2c-10.3,0-19.5,3.7-19.5,14v29.9H169.5z"></path>{" "}
                      </g>
                    </svg>
                  </Link>
                  <Link
                    href="https://twitter.com"
                    className="text-blue-500 hover:text-blue-600"
                    target="_blank"
                  >
                    <svg
                      fill="currentColor"
                      height="24px"
                      width="24px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="-143 145 512 512"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M215.2,361.2 c0.1,2.2,0.1,4.5,0.1,6.8c0,69.5-52.9,149.7-149.7,149.7c-29.7,0-57.4-8.7-80.6-23.6c4.1,0.5,8.3,0.7,12.6,0.7 c24.6,0,47.3-8.4,65.3-22.5c-23-0.4-42.5-15.6-49.1-36.5c3.2,0.6,6.5,0.9,9.9,0.9c4.8,0,9.5-0.6,13.9-1.9 C13.5,430-4.6,408.7-4.6,383.2v-0.6c7.1,3.9,15.2,6.3,23.8,6.6c-14.1-9.4-23.4-25.6-23.4-43.8c0-9.6,2.6-18.7,7.1-26.5 c26,31.9,64.7,52.8,108.4,55c-0.9-3.8-1.4-7.8-1.4-12c0-29,23.6-52.6,52.6-52.6c15.1,0,28.8,6.4,38.4,16.6 c12-2.4,23.2-6.7,33.4-12.8c-3.9,12.3-12.3,22.6-23.1,29.1c10.6-1.3,20.8-4.1,30.2-8.3C234.4,344.5,225.5,353.7,215.2,361.2z"></path>{" "}
                      </g>
                    </svg>
                  </Link>
                  <Link
                    href="https://instagram.com"
                    className="text-blue-500 hover:text-blue-600"
                    target="_blank"
                  >
                    <svg
                      fill="currentColor"
                      height="24px"
                      width="24px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-143 145 512 512"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <path d="M113,446c24.8,0,45.1-20.2,45.1-45.1c0-9.8-3.2-18.9-8.5-26.3c-8.2-11.3-21.5-18.8-36.5-18.8s-28.3,7.4-36.5,18.8 c-5.3,7.4-8.5,16.5-8.5,26.3C68,425.8,88.2,446,113,446z"></path>{" "}
                          <polygon points="211.4,345.9 211.4,308.1 211.4,302.5 205.8,302.5 168,302.6 168.2,346 "></polygon>{" "}
                          <path d="M183,401c0,38.6-31.4,70-70,70c-38.6,0-70-31.4-70-70c0-9.3,1.9-18.2,5.2-26.3H10v104.8C10,493,21,504,34.5,504h157 c13.5,0,24.5-11,24.5-24.5V374.7h-38.2C181.2,382.8,183,391.7,183,401z"></path>{" "}
                          <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M241,374.7v104.8 c0,27.3-22.2,49.5-49.5,49.5h-157C7.2,529-15,506.8-15,479.5V374.7v-52.3c0-27.3,22.2-49.5,49.5-49.5h157 c27.3,0,49.5,22.2,49.5,49.5V374.7z"></path>{" "}
                        </g>
                      </g>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </div>
  );
}
