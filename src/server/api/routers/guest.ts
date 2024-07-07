import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import resend from "~/lib/resend";
import GuestInvitationEmailTemplate from "~/email-templates/emails/invitation";

export const guestRouter = createTRPCRouter({
  getGuestByStatus: protectedProcedure
    .input(z.object({ weddingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const unsentGuestEmails = await db.guest.findMany({
        where: {
          status: "NOT_SENT",
          weddingId: input.weddingId,
          Wedding: {
            userId,
          },
        },
      });
      const sentGuestEmails = await db.guest.findMany({
        where: {
          status: "SENT",
          weddingId: input.weddingId,
          Wedding: {
            userId,
          },
        },
      });

      return {
        unsentGuestEmails,
        sentGuestEmails,
      };
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const guest = await db.guest.findFirst({
        where: {
          id: input.id,
          Wedding: {
            userId,
          },
        },
      });

      if (!guest) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return guest;
    }),
  add: protectedProcedure
    .input(
      z.object({
        weddingId: z.string(),
        guests: z.array(
          z.object({ name: z.string(), email: z.string().email() }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !ctx.user.email)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorized",
        });

      const wedding = await db.wedding.findFirst({
        where: {
          id: input.weddingId,
          userId: ctx.userId,
        },
      });

      if (!wedding)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wedding not found!",
        });

      const newGuests = await db.guest.createMany({
        data: input.guests.map((g) => ({ weddingId: wedding.id, ...g })),
      });

      return {
        message: `${newGuests.count} guests added.`,
      };
    }),
  sendMails: protectedProcedure
    .input(
      z.object({
        weddingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !ctx.user.email)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorized",
        });

      const wedding = await db.wedding.findFirst({
        where: {
          id: input.weddingId,
          userId: ctx.userId,
        },
        include: {
          Guest: {
            where: { status: "NOT_SENT" },
          },
        },
      });

      if (!wedding)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wedding not found!",
        });

      if (wedding.Guest.length === 0)
        return {
          message: "No guests left to send the invitation",
        };

      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: wedding.Guest.map((g) => g.email),
        subject: `Invitation for ${wedding.groomName} and ${wedding.brideName} wedding`,
        react: GuestInvitationEmailTemplate({
          groomName: wedding.groomName,
          brideName: wedding.brideName,
          date: wedding.date.toString(),
        }),
      });

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });

      const updatedGuests = await db.guest.updateMany({
        data: {
          sentAt: new Date(),
          status: "SENT",
        },
        where: {
          id: {
            in: wedding.Guest.map((g) => g.id),
          },
        },
      });

      return {
        message: "Sending mails to guests.",
        totalMailSent: updatedGuests.count,
      };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorized",
        });

      const guest = await db.guest.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!guest)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guest not found!",
        });

      return await db.guest.delete({
        where: input,
      });
    }),
});
