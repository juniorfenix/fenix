import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1 min — cache hits feel instant on revisit
        gcTime: 5 * 60_000, // keep in memory for 5 min after unmount
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent", // hover/touchstart preloads route + loader
    defaultPreloadStaleTime: 0, // let Query manage freshness
    defaultPreloadDelay: 0, // fire immediately on intent
  });

  return router;
};
