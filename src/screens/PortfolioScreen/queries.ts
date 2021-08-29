/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserPortfolio = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            networth
            portfolioCoins {
                items {
                    id
                    amount
                    coin {
                        id
                        name
                        symbol
                    }
                }
                nextToken
            }
        }
    }
`;
