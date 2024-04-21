import { ArrowRight } from "lucide-react";
import Link from "next/link";

import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { buttonVariants } from "~/components/ui/button";

export default async function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-blue-950/40 px-7 py-2 shadow-md backdrop-blur transition-all ">
        <h1 className="text-xl font-semibold ">Wedding Planner</h1>
      </div>

      <h2 className="max-w-3xl text-4xl font-bold md:text-5xl lg:text-6xl">
        Seamlessly plan your{" "}
        <span className="text-emerald-500">perfect day</span>, with{" "}
        <span className="text-red-500">love</span> in every detail.
      </h2>

      <p className="mt-5 max-w-prose text-white sm:text-lg">
        Our wedding planner app ensures every detail is crafted with love,
        making your special day seamless and unforgettable. Plan effortlessly
        today!
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
  );
}
