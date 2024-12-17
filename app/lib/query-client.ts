import { QueryClient } from "@tanstack/react-query";

import { remember } from "@epic-web/remember";

export const queryClient = remember(
  "react-query",
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 10,
        },
      },
    })
);