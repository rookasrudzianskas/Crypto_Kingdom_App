/* Amplify Params - DO NOT EDIT
	API_CRYPTOKINGDOM_GRAPHQLAPIENDPOINTOUTPUT
	API_CRYPTOKINGDOM_GRAPHQLAPIIDOUTPUT
Amplify Params - DO NOT EDIT */

const { CognitoIdentityServiceProvider,  DynamoDB} = require('aws-sdk');
// const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const ddb = new DynamoDB();

// /**
//  * Get user pool information from environment variables.
//  */
//
// const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
// if (!COGNITO_USERPOOL_ID) {
//     throw new Error(`Function requires environment variable: 'COGNITO_USERPOOL_ID'`);
// }
// const COGNITO_USERNAME_CLAIM_KEY = 'cognito:username';



const getCoinAmount = async (coinPortfolioCoinId, userId) => {
    const params = {
        Key: {
            id: { S: coinPortfolioCoinId },
        },
        TableName: process.env.PORTFOLIO_COIN_TABLE,
    }
    const coinData = await ddb.getItem(params).promise();
    console.log('portfolio coin data');
    console.log(coinData);
    // @TODO check if it is indeed the coin and belongs to the user
    // userId: { S: userId },

    return coinData?.Item?.amount?.N || 0;
}


const getUsdAmount = async (usdPortfolioCoinId, userId) => {
    const params = {
        Key: {
            id: { S: usdPortfolioCoinId },
        },
        TableName: process.env.PORTFOLIO_COIN_TABLE,
    }
    const coinData = await ddb.getItem(params).promise();
    console.log('usd coin data');
    console.log(coinData);

    // @TODO check if it is indeed the usd coin and belongs to the user

    // coinId: { S: process.env.USD_COIN_ID },
    // userId: { S: userId },

    return coinData?.Item?.amount?.N || 0;

}

const getCoin = async (coinId)  => {
    const params = {
        Key: {
          id: { S: coinId }
        },
        TableName: process.env.COIN_TABLE,
    }
    const coinData = await ddb.getItem(params).promise();
    console.log('coin data');
    console.log(coinData);
    return coinData;
}


const canBuyCoin = (coin, amountToBuy, usdAmount) => {
    return usdAmount >= coin.Item.currentPrice.N * amountToBuy
}

const canSellCoin = (amountToSell, portfolioAmount) => {
    return portfolioAmount >= amountToSell
}

const buyCoin = () => {
    console.log("BUYYYYY");
}

const sellCoin = () => {
    console.log("SELLLLL");
}


/**
 * Using this as the entry point, you can use a single function to handle many resolvers.
 */

const resolvers = {
    Mutation: {
        exchangeCoins: async ctx => {
            console.log('ctx')
            console.log(ctx);
            const { coinId, isBuy, amount, usdPortfolioCoinId, coinPortfolioCoinId } = ctx.arguments;
            const userId = ctx.identity.sub;
            // const params = {
            //     UserPoolId: COGNITO_USERPOOL_ID, /* required */
            //     Username: ctx.identity.claims[COGNITO_USERNAME_CLAIM_KEY], /* required */
            // };
            // try {
            //     // Read more: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminGetUser-property
            //     const userResponse = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
            //     console.log(userResponse);
            // } catch (e) {
            //     console.log(e);
            //     // throw new Error(`NOT FOUND`);
            // }

            const usdAmount = !usdPortfolioCoinId ? 0 : await getUsdAmount(usdPortfolioCoinId, userId);
            const coinAmount = !coinPortfolioCoinId ? 0 : await getCoinAmount(coinPortfolioCoinId, userId);
            const coin = await getCoin(coinId);

            try {

                if(isBuy && canBuyCoin(coin, amount, usdAmount)) {
                    buyCoin();
                } else if(!isBuy && canSellCoin(amount, coinAmount)) {
                    sellCoin();
                } else {
                    throw new Error(isBuy ? `Not enough USD` : `Not enough coins to sell`);
                }

            } catch (e) {
                console.log(e);
                throw new Error(`Unexpected error exchanging coins`);
            }


                try {
                    await getCoin(ctx.arguments.coinId);
                } catch (e) {
                    console.log("Error getting the coin");
                    console.log(e);
                }

            try {
                await getUsdAmount(ctx.arguments.usdPortfolioCoinId, ctx.identity.sub);
            } catch (e) {
                console.log("Error getting the USD Coin");
                console.log(e);
            }


            try {
                await getCoinAmount(ctx.arguments.coinPortfolioCoinId, ctx.identity.sub);
            } catch (e) {
                console.log("Error getting the USD Coin");
                console.log(e);
            }
            return true;
        }
    },
}

// event
// {
//   "typeName": "Query", /* Filled dynamically based on @function usage location */
//   "fieldName": "me", /* Filled dynamically based on @function usage location */
//   "arguments": { /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }
exports.handler = async (event) => {
    const typeHandler = resolvers[event.typeName];
    if (typeHandler) {
        const resolver = typeHandler[event.fieldName];
        if (resolver) {
            return await resolver(event);
        }
    }
    throw new Error("Resolver not found.");
};
