import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/pages";

const es = initEdgeStore.create();

// main router
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// This type is used to create the type-safe client for the frontend.
export type EdgeStoreRouter = typeof edgeStoreRouter;
