import { headers } from "next/headers";

import { authClient } from "./auth-client";

export const getServerSession = async () => {
  const { data: session, error } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (error) {
    return null;
  }

  return session;
};
