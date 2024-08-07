import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { weddingRouter } from "./routers/wedding";
import { eventRouter } from "./routers/event";
import { mediaRouter } from "./routers/media";
import { guestRouter } from "./routers/guest";
import { venueRouter } from "./routers/venue";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  wedding: weddingRouter,
  venue: venueRouter,
  event: eventRouter,
  media: mediaRouter,
  guest: guestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
