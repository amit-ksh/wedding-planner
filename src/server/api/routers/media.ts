import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deleteResources } from "~/lib/cloudinary";

export const mediaRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const { eventId } = input;

      return await db.media.findMany({
        where: {
          eventId,
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      return await db.media.findFirst({
        where: {
          id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        publicId: z.string(),
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.media.create({
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const media = await db.media.findFirst({ where: input });

      if (!media)
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Media not found!",
        });

      const resp = await deleteResources(media.publicId, media.type);

      if (resp.deleted[media.publicId] === "deleted") {
        // finally delete from the database
        await db.media.delete({ where: input });

        return {
          code: "SUCCESS",
          message: `${media?.type} deleted successfully`,
          id: media.id,
        };
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Media not found!",
        });
      }
    }),
});
