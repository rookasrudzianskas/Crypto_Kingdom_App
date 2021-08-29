/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserPortfolio = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            name
            email
            image
            networth
            portfolioCoins {
                items {
                    id
                    amount
                    userId
                    coinId
                    createdAt
                    updatedAt
                }
                nextToken
            }
            createdAt
            updatedAt
        }
    }
`;
