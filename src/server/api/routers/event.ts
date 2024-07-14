import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { deleteResources } from "~/lib/cloudinary";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ weddingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { weddingId } = input;
      const { userId } = ctx;

      return await db.event.findMany({
        where: {
          weddingId,
          Wedding: {
            userId,
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      return await db.event.findFirst({
        where: {
          id,
          Wedding: { userId },
        },
        include: {
          Media: true,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        description: z.string(),
        weddingId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.event.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        date: z.date(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.event.update({
        where: { id: input.id },
        data: {
          ...input,
          id: undefined,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await deleteEvent(input.id);
    }),
});

export async function deleteEvent(id: string) {
  const event = await db.event.findFirst({
    where: { id },
    select: {
      Media: true,
    },
  });

  if (!event)
    throw new TRPCError({
      code: "NOT_FOUND",
    });

  // delete all the images and videos
  for (const media of event?.Media) {
    await deleteResources(media.publicId, media.type);
  }

  return await db.event.delete({
    where: { id },
  });
}
