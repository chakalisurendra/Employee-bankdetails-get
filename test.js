const { expect } = require("chai");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { getBankDetails, getAllBanks, createEmployeeBankDetails } = require("./api");

describe("positive getBankDetails", () => {
  let originalSend;
  before(() => {
    // Store the original send method
    originalSend = DynamoDBClient.prototype.send;
  });
  after(() => {
    // Restore the original send method after all tests
    DynamoDBClient.prototype.send = originalSend;
  });
  it("should return employee bank details when the item exists", async () => {
    DynamoDBClient.prototype.send = async function (command) {
      // Create a mock send function that returns mock data
      const mockItem = { empId: "1233", bankDetails: "Sample Bank Details" };
      return { Item: marshall(mockItem) };
    };
    // set a event for sending pathParameters
    const event = {
      pathParameters: { empId: "1233" },
    };
    // calling the getBankDetails from the api.js file
    const response = await getBankDetails(event);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.deep.equal({
      message: "Successfully retrieved Employee bank details.",
      data: { empId: "1233", bankDetails: "Sample Bank Details" },
    });
  });

  it("should return an error when the item is not found", async () => {
    // Create a mock send function that returns an empty response
    DynamoDBClient.prototype.send = async function (command) {
      return {};
    };
    // set a event for sending pathParameters
    const event = {
      pathParameters: { empId: "NotFoundEmpId" },
    };
    // calling the getBankDetails from the api.js file
    const response = await getBankDetails(event);
    expect(response.statusCode).to.equal(404);
    expect(JSON.parse(response.body)).to.deep.equal({
      message: "Employee bank details not found.",
    });
  });

  it("should return an error when an unexpected error occurs", async () => {
    // Create a mock send function that throws an error with a stack trace
    DynamoDBClient.prototype.send = async function (command) {
      throw new Error("Unexpected error");
    };
    // set a event for sending pathParameters
    const event = {
      pathParameters: { empId: "1233" },
    };
    // calling the getBankDetails from the api.js file
    const response = await getBankDetails(event);
    // verifying with expect and actual messages
    expect(JSON.parse(response.body)).to.deep.equal({
      //statusCode: 500,
      message: "Failed to retrieved employee bank details.",
      errorMsg: "Unexpected error",
    });
  });
});

describe("Get the all bank details of employees ", () => {
  let originalSend;
  before(() => {
    // Store the original send method
    originalSend = DynamoDBClient.prototype.send;
  });
  after(() => {
    // Restore the original send method after all tests
    DynamoDBClient.prototype.send = originalSend;
  });

  it("should return all employee bank details when the scan operation is successful", async () => {
    const mockItems = [
      // Declare mockItems here
      { empId: "1233", bankDetails: "Sample Bank Details 1" },
      { empId: "4567", bankDetails: "Sample Bank Details 2" },
    ];
    DynamoDBClient.prototype.send = async function (command) {
      // Simulate a successful scan operation with mock data
      return { Items: mockItems.map((item) => marshall(item)) };
    };
    const response = await getAllBanks();
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.deep.equal({
      message: "Successfully retrieved all Employees bank details.",
      data: [
        { empId: "1233", bankDetails: "Sample Bank Details 1" },
        { empId: "4567", bankDetails: "Sample Bank Details 2" },
      ],
    });
  });
  it("should return a 404 status when no items are found", async () => {
    // Mock the behavior of DynamoDBClient's send method (ScanCommand)
    DynamoDBClient.prototype.send = async function (command) {
      // Simulate a successful scan operation with mock data
      return { Items: [] };
    };
    // Call your function with the mocked client
    const response = await getAllBanks();
    expect(response.statusCode).to.equal(404);
    expect(JSON.parse(response.body)).to.deep.equal({
      message: "Employee bank details not found.",
    });
  });

  it("should return an error response when an error occurs during the scan operation", async () => {
    DynamoDBClient.prototype.send = async function (command) {
      throw new Error("Scan operation failed");
    };
    // Calling the getAllBanks method from the api.js file
    const response = await getAllBanks();
    // verifying with expect and actual messages
    expect(JSON.parse(response.body)).to.deep.equal({
      //statusCode: 500,
      message: "Failed to retrieved Employee bank details.",
      errorMsg: "Scan operation failed",
    });
  });
});


///////////////////////////////////////////////////////////////////////////////////////////



// Mock DynamoDBClient to avoid making actual AWS calls
const mockClient = {
  send: () => ({}),
};
// Mock employee data for createEmployee
const createEmployeeData = {
    postId: "3",
    bankDetails: {
      BankName: "ka",
      BranchName: "hydrabad",
      BranchAddress: "bangalore",
      CustomerNumber: "12345678912",
      BankAccountNumber: "55566444412",
      IsSalaryAccount: "yes",
      IsActive: "yes",
      IsDeleted: "false"
    }
  };
// Mock employee data for updateEmployee
const updateEmployeeData = {
    BankName: "kanara",
    BranchName: "hydrabad",
    BranchAddress: "bangalore",
    CustomerNumber: "12345678912",
    BankAccountNumber: "55566444412",
    IsSalaryAccount: "yes",
    IsActive: "yes",
    IsDeleted: "flase"
};
// Successfully create an employee
// Successfully create an employee
describe('createEmployee unit tests', () => {
    let originalDynamoDBClient;
    before(() => {
      originalDynamoDBClient = DynamoDBClient;
      DynamoDBClient.prototype.send = () => mockClient.send();
    });
    after(() => {
      DynamoDBClient.prototype.send = originalDynamoDBClient.prototype.send;
    });
    it('successfully create an employee', async () => {
      // Mock event object with employee data
      let event = {
        body: JSON.stringify(createEmployeeData),
      };
      const response = await createEmployeeBankDetails(event);
      expect(response.statusCode).to.equal(200);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.message).to.equal('Successfully created post.'); // Correct the message if necessary
    });
    it('fails to create an employee with missing data', async () => {
      // Mock event object with missing data
      let event = {
        body: JSON.stringify({}), // Missing required data
      };
      const response = await createEmployeeBankDetails(event);
      expect(response.statusCode).to.equal(500); // Expecting an error response
    });
    it('fails to create an employee with invalid data', async () => {
      // Mock event object with invalid data
      let event = {
        // body: JSON.stringify({
        //   // Invalid data that should fail validation
        //   BankName: 'AB', // Too short
        // }),
        body: JSON.stringify(createEmployeeData),
      };
      const response = await createEmployeeBankDetails(event);
      expect(response.statusCode).to.equal(500); // Expecting an error response
      //const responseBody = JSON.parse(response.body);
      //expect(responseBody.message).to.equal('BankName should be minimum 3 characters!'); // Correct the message if necessary
      expect(JSON.parse(response.body)).to.deep.equal({
        message: "BankName should be minimum 3 characters!",
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////
