// This program is for getting the employee bank details based http GET method.
const {
  DynamoDBClient, // Dynamodb instance
  GetItemCommand, // Retrieve data fron dynamoDb table
  ScanCommand, // Scan the table
} = require("@aws-sdk/client-dynamodb"); //aws-sdk is used to build rest APIs
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb"); // Importing marshall, unmarshall for Convert a JavaScript object into a DynamoDB record and a DynamoDB record into a JavaScript object
const client = new DynamoDBClient(); // Create new instance of DynamoDBClient to client, will use this constant across the program

// This function for the get the employee bank details based on the employee id.
const getBankDetails = async (event) => {
  const response = { statusCode: 200 }; // Setting the default status code to 200
  try {
    // Define table name and employeeId key with its value
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME, // Getting table name from the servetless.yml and setting to the TableName
      Key: marshall({ empId: event.pathParameters.empId }), // Convert a JavaScript object into a DynamoDB record.
    };
    //await response from db when sent getItem command with params
    //containing tablename, key and only display empId and bank details
    const { Item } = await client.send(new GetItemCommand(params)); //An asynchronous call to DynamoDB to retrieve an item
    console.log({ Item });
    if (!Item) {
      // If there is no employee bank details found
      response.statusCode = 404; // Setting the status code to 404
      response.body = JSON.stringify({
        message: "Employee bank details not found.",
      }); // Setting error message
    } else {
      // If employee bank details found in the dynamoDB set to data
      response.body = JSON.stringify({
        message: "Successfully retrieved Employee bank details.",
        data: unmarshall(Item), // A DynamoDB record into a JavaScript object and setting to the data
      });
    }
  } catch (e) {
    // If any errors will occurred
    console.error(e);
    response.body = JSON.stringify({
      statusCode: e.statusCode, // Set server side status code
      message: "Failed to retrieved employee bank details.",
      errorMsg: e.message, // Set error message
    });
  }
  return response;
};
// This function for the get the all employees bank details.
const getAllBanks = async () => {
  const response = { statusCode: 200 }; // Setting the default status code to 200
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
    response.body = JSON.stringify({
      statusCode: e.statusCode, // Handle any server response errors
      message: "Failed to retrieved Employee bank details.",
      errorMsg: e.message, // Handle any server response message
    });
  }
  return response; //Return response with statusCode and data.
};

module.exports = {
  getBankDetails,
  getAllBanks,
}; // exporting the function
