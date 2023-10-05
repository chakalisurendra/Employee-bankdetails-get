const {
  DynamoDBClient,
  GetItemCommand,
  // PutItemCommand,
  // DeleteItemCommand,
  ScanCommand,
  //UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient();

const getBankDetails = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ empId: event.pathParameters.empId }),
    };
    const { Item } = await client.send(new GetItemCommand(params));
    console.log({ Item });
    if (!Item) {
      // Handle item not found
      response.statusCode = 404;
      response.body = JSON.stringify({
        message: "Employee bank details not found.",
      });
    } else {
      response.body = JSON.stringify({
        message: "Successfully retrieved Employee bank details.",
        data: unmarshall(Item),
      });
    }
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieved employee bank details.",
      errorMsg: e.message,
    });
  }
  return response;
};
const getAllBanks = async () => {
  const response = { statusCode: 200 };
  try {
    const { Items } = await client.send(
      new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME })
    );
   
    if (Items.length === 0) {
      // Handle the case where no items are found
      response.statusCode = 404;
      response.body = JSON.stringify({
        message: "Employee bank details not found.",
      });
    } else {
      response.body = JSON.stringify({
        message: "Successfully retrieved all Employees bank details.",
        data: Items.map((item) => unmarshall(item)),
      });
    }
    // response.body = JSON.stringify({
    //   message: "Successfully retrieved all Employees bank details.",
    //   data: Items.map((item) => unmarshall(item)),
    // });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieved Employee bank details.",
      errorMsg: e.message,
    });
  }
  return response;
};


module.exports = {
  getBankDetails,
  // createPost,
  // updatePost,
  // deletePost,
  getAllBanks,
};
