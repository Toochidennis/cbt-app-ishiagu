import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: process.env.BASE_URL,
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            apiKey: process.env.SUPERBASE_KEY,
            Authorization: `Bearer ${process.env.SUPERBASE_KEY}`,
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});