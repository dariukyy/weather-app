import { ApolloClient, InMemoryCache } from "@apollo/client";

let client: ApolloClient<any | null>;

export const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      uri: process.env.API_URL,
      cache: new InMemoryCache(),
      headers: {
        Authorization: `api key ${process.env.NEXT_PUBLIC_STEPZEN_API_KEY}`,
      },
    });
  }

  return client;
};
