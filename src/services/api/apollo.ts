import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: import.meta.env.BASE_URL,
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            apiKey: import.meta.env.SUPERBASE_KEY,
            Authorization: `Bearer ${import.meta.env.SUPERBASE_KEY}`,
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});