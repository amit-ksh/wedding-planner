import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Values include:
// - 1 = Cheap
// - 2 = Moderate
// - 3 = Expensive
// - 4 = Very Expensive.

// - 0.0 = LightMediumGrey (#C7CDCF)
// - 0.0 <> 4.0 = Red (#E6092C)
// - 4.0 <> 5.0 = DarkOrange (#FF6701)
// - 5.0 <> 6.0 = Orange (#FF9600)
// - 6.0 <> 7.0 = Yellow (#FFC800)
// - 7.0 <> 8.0 = LightGreen (#C5DE35)
// - 8.0 <> 9.0 = Green (#73CF42)
// - 9.0 + = DarkGreen (#00B551)

export const venueRouter = createTRPCRouter({
  getVenues: protectedProcedure
    .input(
      z.object({ query: z.string(), state: z.string(), country: z.string() }),
    )
    .query(async ({ input }) => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq33Ta5BEEhsBu5GQbP1dXLxPkfwknZ5TTs7ILK838QA+Y='
        }
      };
      const query = `query=wedding hall or banquet&fields=fsq_id,name,geocodes,location,description,verified,price,photos,rating,website,tel,email,features`
      const resp = await fetch(`https://api.foursquare.com/v3/places/search?${query}`, options)
      const venues = await resp.json() as Array<{
        fsq_id: string;
        name: string;
        description?: string;
        rating?: number;
        price: number;
        tel?: string;
        email?: string;
        website?: string;
        verified: boolean; 
        photos: Array<{
        id: string;
        prefix: string;
        suffix: string;
        width: number;
        height: number;
        createdAt: string;
        }>;
        geocodes: {
          main: {
            latitude: number; longitude: number; 
          }
        };
        location: {
          address?: string;
          country?: string;
          cross_street?: string;
          formatted_address?: string;
          locality?: string;
          postcode?: string;
          region?: string;
        };
      }>

      return venues
    }),
  getWeddingVenue: protectedProcedure
    .input(z.object({ weddingId: z.string() }))
    .query(async ({ input }) => {
      const { weddingId } = input;

      if (!weddingId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No wedding found",
        });

      return await db.venue.findFirst({
        where: {
          Wedding: {
            id: input.weddingId,
          },
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Venue found",
        });

      return await db.venue.findFirst({
        where: input,
      });
    }),
  book: protectedProcedure
    .input(
      z.object({
        weddingId: z.string(),
        name: z.string(),
        address: z.string(),
        photos: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.venue.create({
        data: input,
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        weddingId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const removeVenues = await db.venue.deleteMany({
        where: {
          Wedding: {
            id: input.weddingId,
          },
        },
      });

      if (removeVenues.count <= 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Venue not found!",
        });

      return {
        code: "SUCCESS",
        message: `Venue removed!`,
      };
    }),
});
