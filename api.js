const {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb"); // CommonJS import
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb"); // Importing marshall, unmarshall for Convert a JavaScript object into a DynamoDB record and a DynamoDB record into a JavaScript object
const client = new DynamoDBClient(); // create a new DynamoDBClient

// This function for the get the employee bank details based on the employee id.
const getBankDetails = async (event) => {
  const response = { statusCode: 200 }; // Setting the default status code
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME, // Getting table name from the servetless.yml and setting to the TableName
      Key: marshall({ empId: event.pathParameters.empId }), // Convert a JavaScript object into a DynamoDB record.
    };
    const { Item } = await client.send(new GetItemCommand(params)); //An asynchronous call to DynamoDB to retrieve an item
    console.log({ Item });
    if (!Item) {
      // If there is no employee bank details found
      response.statusCode = 404; // Setting the status code to 404
      response.body = JSON.stringify({
        message: "Employee bank details not found.",
      }); // Setting error message
    } else {
      // If employee bank details found in the dynamoDB setting the data
      response.body = JSON.stringify({
        message: "Successfully retrieved Employee bank details.",
        data: unmarshall(Item), // A DynamoDB record into a JavaScript object and setting to the data
      });
    }
  } catch (e) {
    // If any errors will occurred
    console.error(e);
    response.statusCode = 500; // Setting the status code to 500
    response.body = JSON.stringify({
      message: "Failed to retrieved employee bank details.",
      errorMsg: e.message, // Setting error message
    });
  }
  return response;
};
// This function for the get the all employees bank details.
const getAllBanks = async () => {
  const response = { statusCode: 200 }; // Setting the default status code
  try {
    const { Items } = await client.send(
      new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME })
    ); // Getting table name from the servetless.yml and setting to the TableName

    if (Items.length === 0) {
      // If there is no employee bank details found
      response.statusCode = 404; // Setting the status code to 404
      response.body = JSON.stringify({
        message: "Employee bank details not found.",
      }); // Setting error message
    } else {
      // If employee bank details found in the dynamoDB setting the data
      response.body = JSON.stringify({
        message: "Successfully retrieved all Employees bank details.",
        data: Items.map((item) => unmarshall(item)), // A DynamoDB record into a JavaScript object and setting to the data
      });
    }
  } catch (e) {
    // If any errors will occurred
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieved Employee bank details.",
      errorMsg: e.message, // Setting error message
    });
  }
  return response; // returning the response
};

module.exports = {
  getBankDetails,
  getAllBanks,
}; // exporting the function
