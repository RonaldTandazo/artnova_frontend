import { ApolloClient, InMemoryCache, Observable, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { BACKEND_URL, WS_URL } from './Helpers';

let getAccessToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let performLogout: () => void = () => {};
let callRefreshToken: (token: string) => Promise<any> = async () => null;
  let isRefreshing = false;
  let refreshTokenPromise: Promise<any> | null = null;

export const setAuthCallbacks = (
  accessTokenCallback: () => string | null,
  refreshTokenCallback: () => string | null,
  refreshTokenProcessCallback: (token: string) => Promise<any>,
  logoutCallback: () => void
) => {
  getAccessToken = accessTokenCallback;
  getRefreshToken = refreshTokenCallback;
  callRefreshToken = refreshTokenProcessCallback;
  performLogout = logoutCallback;
};

const httpLink = new UploadHttpLink({
  uri: `${BACKEND_URL}/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });
  return forward(operation);
});

const errorLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    let subscriber = forward(operation).subscribe({
      next: (result) => observer.next(result),
      error: (networkError) => {
        const { graphQLErrors } = networkError;
        
        if (graphQLErrors) {
          for (let err of graphQLErrors) {
            if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('Unauthorized')) {
              const refreshToken = getRefreshToken();

              if (!refreshToken) {
                performLogout();
                observer.error(networkError);
                return;
              }

              if (isRefreshing) {
                refreshTokenPromise!.then(() => {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${getAccessToken()}`,
                    },
                  });
                  const reattemptSubscriber = forward(operation).subscribe(observer);
                  return () => reattemptSubscriber.unsubscribe();
                }).catch(() => {
                  observer.error(networkError);
                });
              } else {
                isRefreshing = true;
                refreshTokenPromise = new Promise((resolve, reject) => {
                  callRefreshToken(refreshToken)
                    .then(({ accessToken }) => {
                      isRefreshing = false;
                      refreshTokenPromise = null;
                      resolve(accessToken);
                    })
                    .catch(refreshError => {
                      isRefreshing = false;
                      refreshTokenPromise = null;
                      performLogout();
                      reject(refreshError);
                    });
                });
                
                refreshTokenPromise!.then(() => {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${getAccessToken()}`,
                    },
                  });
                  const reattemptSubscriber = forward(operation).subscribe(observer);
                  return () => reattemptSubscriber.unsubscribe();
                }).catch(() => {
                  observer.error(networkError);
                });
              }
              return;
            }
          }
        }
        observer.error(networkError);
      },
      complete: () => observer.complete(),
    });
    return () => subscriber.unsubscribe();
  });
});

const wsLink = new GraphQLWsLink(createClient({
  url: `${WS_URL}/graphql/ws`,
  connectionParams: () => {
    const token = getAccessToken();
    return {
      authToken: token ? `Bearer ${token}` : "",
    };
  },
}));

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  ApolloLink.from([errorLink, authLink, httpLink]),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});