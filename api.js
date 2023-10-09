// This program is for getting the employee bank details based http GET method.
const {
  DynamoDBClient, // Dynamodb instance
  GetItemCommand, // Retrieve data fron dynamoDb table
  ScanCommand, // Scan the table
  PutItemCommand,
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

//////////////////////////////////////////////////////////////////////////////////////////

// Define regular expressions for validation
const nameRegex = /^[A-Za-z]{3,32}$/;
const CustomerNumberRegex = /^\d{11,12}$/;
const BankAccountNumber = /^\d{11,16}$/;
// Validation function for bankDetails object
const validation = (bankDetails) => {
  if (nameRegex.test(bankDetails.BankName)) {
    return "BankName should be minimum 3 characters!";
  }
  if (nameRegex.test(bankDetails.BranchName)) {
    return "BranchName should be minimum 3 characters!";
  }
  if (nameRegex.test(bankDetails.BranchAddress)) {
    return "BranchAddress should be minimum 3 characters!";
  }
  if (CustomerNumberRegex.test(bankDetails.CustomerNumber)) {
    return "CustomerNumber should be minimum 11 characters!";
  }
  if (BankAccountNumber.test(bankDetails.BankAccountNumber)) {
    return "BankAccountNumber should be minimum 11 digits!";
  }
  //return null; // Validation passed
};
// Function to create an employee
const createEmployeeBankDetails = async (event) => {
  const response = { statusCode: 200 };
  try {
    // Parse the JSON body from the event
    const body = JSON.parse(event.body);
    const bankDetails = body.bankDetails;
    console.log(bankDetails);
    // Perform validation on bankDetails
    const validationError = validation(bankDetails);
    if (validationError) {
      // console.log("CustomerNumber:", bankDetails.CustomerNumber);
      // response.statusCode =500;
      // response.body=JSON.stringify({
      //   message: validationError,
      // })
      response.statusCode = 404; // Setting the status code to 404
      response.body = JSON.stringify({
        message: validationError,
      });
      //throw new Error(validationError);
    } else {
      // Check for required fields in the body
      // if (!body.bankDetails.BankName || !body.bankDetails.BranchName || !body.bankDetails.BranchAddress || !body.bankDetails.BankAccountNumber) {
      //   throw new Error('Required fields are missing.');
      // }
      // Fetch an item from DynamoDB based on postId
      const employeeData = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ empId: body.empId }),
      };
      const { Item } = await client.send(new GetItemCommand(employeeData));
      // Check if an item with the same postId exists in DynamoDB
      if (Item) {
        const item1 = { item2: Item ? unmarshall(Item) : {} };
        console.log(item1);
        // Check if bankDetails already exist in the fetched item
        if (item1.item2.bankDetails) {
          throw new Error("BankDetails already exists!");
        }
      }
      // Define parameters for inserting an item into DynamoDB
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: marshall(
          {
            empId: body.empId,
            bankDetails: {
              BankName: bankDetails.BankName,
              BranchName: bankDetails.BranchName,
              BranchAddress: bankDetails.BranchAddress,
              CustomerNumber: bankDetails.CustomerNumber,
              BankAccountNumber: bankDetails.BankAccountNumber,
              IsSalaryAccount: bankDetails.IsSalaryAccount,
              IsActive: bankDetails.IsActive,
              IsDeleted: bankDetails.IsDeleted,
            },
          }
          //{ removeUndefinedValues: true }
        ),
      };
      // Insert the item into DynamoDB
      await client.send(new PutItemCommand(params));
      response.body = JSON.stringify({
        message: "Successfully created post.",
      });
    }
    //To through the exception if anything failing while creating bankDetails
  } catch (e) {
    console.error(e);
    response.body = JSON.stringify({
      message: "Failed to create BankDetails",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getBankDetails,
  getAllBanks,
  createEmployeeBankDetails,
}; // exporting the function
