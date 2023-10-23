import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/pages";
import { z } from "zod";

const es = initEdgeStore.create();

/** main router */
const edgeStoreRouter = es.router({
  logotypes: es
    .imageBucket({ maxSize: 1024 * 1024 * 10 })
    .input(z.object({ subcategory: z.string() }))
    .path(({ input }) => [{ subcategory: input.subcategory }]),
});

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// This type is used to create the type-safe client for the frontend.
export type EdgeStoreRouter = typeof edgeStoreRouter;
