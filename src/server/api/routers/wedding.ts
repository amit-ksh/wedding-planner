import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const weddingRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.wedding.findMany({
      where: {
        userId,
      },
      include: {
        Venue: {
          select: { name: true },
        },
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const wedding = await db.wedding.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!wedding) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return wedding;
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        brideName: z.string(),
        groomName: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      return await db.wedding.create({
        data: {
          ...input,
          userId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        brideName: z.string(),
        groomName: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      const wedding = await db.wedding.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!wedding) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await db.wedding.update({
        where: { id, userId },
        data: {
          ...input,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const wedding = await db.wedding.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!wedding) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await db.wedding.delete({
        where: {
          ...input,
          userId,
        },
      });
    }),
});
