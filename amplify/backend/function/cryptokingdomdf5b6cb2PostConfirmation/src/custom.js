const aws = require('aws-sdk');
const ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
  if (!event.request.userAttributes.sub) {
    console.log("Error: No user was written to DynamoDB")
    context.done(null, event);
    return;
  }

  // Save the user to DynamoDB
  const date = new Date();

  const Item = {
    Item: {
      'id': { S: event.request.userAttributes.sub },
      '__typename': { S: 'User' },
      'email': { S: event.request.userAttributes.email },
      'createdAt': { S: date.toISOString() },
      'updatedAt': { S: date.toISOString() },
      'networth': { N: "100000.0" },
    },

    if (event.request.userAttributes.picture) {
      Item.image = { S: event.request.userAttributes.picture };
    }


    if (event.request.userAttributes.name) {
      Item.image = { S: event.request.userAttributes.name };
    }



  const params = {
    Item,
    TableName: process.env.USERTABLE,
  }

  // give the user 100 000 dollars in the future | in 5 minutes



  try {
    await ddb.putItem(params).promise();
    console.log("Success");
  } catch (e) {
    console.log("Error", e);
  }

  context.done(null, event);
}

// does not write the user to the dynamo db
