const { expect } = require("chai");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { getBankDetails, getAllBanks } = require("./api");

// describe("positive getBankDetails", () => {
//   let originalSend;
//   before(() => {
//     // Store the original send method
//     originalSend = DynamoDBClient.prototype.send;
//   });

//   after(() => {
//     // Restore the original send method after all tests
//     DynamoDBClient.prototype.send = originalSend;
//   });

//   it("should return employee bank details when the item exists", async () => {
//     DynamoDBClient.prototype.send = async function (command) {
//       // Create a mock send function that returns mock data
//       const mockItem = { empId: "1233", bankDetails: "Sample Bank Details" };
//       return { Item: marshall(mockItem) };
//     };
//     // set a event for sending pathParameters
//     const event = {
//       pathParameters: { empId: "1233" },
//     };
//     // calling the getBankDetails from the api.js file
//     const response = await getBankDetails(event);

//     expect(response.statusCode).to.equal(200);
//     expect(JSON.parse(response.body)).to.deep.equal({
//       message: "Successfully retrieved Employee bank.",
//       data: { empId: "1233", bankDetails: "Sample Bank Details" },
//     });
//   });

//   it("should return an error when the item is not found", async () => {
//     // Create a mock send function that returns an empty response
//     DynamoDBClient.prototype.send = async function (command) {
//       return {};
//     };
//     // set a event for sending pathParameters
//     const event = {
//       pathParameters: { empId: "NotFoundEmpId" },
//     };
//     // calling the getBankDetails from the api.js file
//     const response = await getBankDetails(event);

//     expect(response.statusCode).to.equal(404);
//     expect(JSON.parse(response.body)).to.deep.equal({
//       message: "Employee bank details not found.",
//     });
//   });

//   it("should return an error when an unexpected error occurs", async () => {
//     // Create a mock send function that throws an error with a stack trace
//     DynamoDBClient.prototype.send = async function (command) {
//       throw new Error("Unexpected error");
//     };
//     // set a event for sending pathParameters
//     const event = {
//       pathParameters: { empId: "1233" },
//     };
//     // calling the getBankDetails from the api.js file
//     const response = await getBankDetails(event);

//     expect(response.statusCode).to.equal(500);
//     expect(JSON.parse(response.body)).to.deep.equal({
//       message: "Failed to get employee bank details.",
//       errorMsg: "Unexpected error",
//     });
//   });
// });



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
    // it("should return all employee bank details when the scan operation is successful", async () => {
    //     DynamoDBClient.prototype.send = async function (command) {
    //       // Simulate a successful scan operation with mock data
          
    //       const mockItems = [
    //         { empId: "1233", bankDetails: "Sample Bank Details 1" },
    //         { empId: "4567", bankDetails: "Sample Bank Details 2" },
    //       ];
    //       return { Items: mockItems.map(marshall) };
    //     };
      
    //     const response = await getAllBanks();
      
    //     expect(response.statusCode).to.equal(200);
    //     expect(JSON.parse(response.body)).to.deep.equal({
    //       message: "Successfully retrieved all Employees bank details.",
    //       data: [
    //         { empId: "1233", bankDetails: "Sample Bank Details 1" },
    //         { empId: "4567", bankDetails: "Sample Bank Details 2" },
    //       ],
    //       Items: mockItems,
    //     });
    //   });
      
    //   it("should return an empty array when no employee bank details are found", async () => {
    //     DynamoDBClient.prototype.send = async function (command) {
    //       // Simulate a successful scan operation with no items
    //       return { Items: [] };
    //     };
      
    //     const response = await getAllBanks();
      
    //     expect(response.statusCode).to.equal(200);
    //     expect(JSON.parse(response.body)).to.deep.equal({
    //       message: "Successfully retrieved all Employees bank details.",
    //       data: [],
    //       Items: [],
    //     });
    //   });
    //   it("should return an error response when an error occurs during the scan operation", async () => {
    //     DynamoDBClient.prototype.send = async function (command) {
    //       // Simulate an error during the scan operation
    //       throw new Error("Scan operation failed");
    //     };
      
    //     const response = await getAllBanks();
      
    //     expect(response.statusCode).to.equal(500);
    //     expect(JSON.parse(response.body)).to.deep.equal({
    //       message: "Failed to retrieve posts.",
    //       errorMsg: "Scan operation failed",
    //     });
    //   });
            

    // it("should return all employee bank details when the scan operation is successful", async () => {
    //     DynamoDBClient.prototype.send = async function (command) {
    //       // Simulate a successful scan operation with mock data
    //       const mockItems = [
    //         { empId: "1233", bankDetails: "Sample Bank Details 1" },
    //         { empId: "4567", bankDetails: "Sample Bank Details 2" },
    //       ];
    //       return { Items: mockItems.map((item) => marshall(item)) };
    //     };
      
    //     const response = await getAllBanks();
      
    //     expect(response.statusCode).to.equal(200);
    //     expect(JSON.parse(response.body)).to.deep.equal({
    //       message: "Successfully retrieved all Employees bank details.",
    //       data: [
    //         { empId: "1233", bankDetails: "Sample Bank Details 1" },
    //         { empId: "4567", bankDetails: "Sample Bank Details 2" },
    //       ],
    //       Items: mockItems, // Remove this line as it's not needed
    //     });
    //   });
      

    it("should return all employee bank details when the scan operation is successful", async () => {
        const mockItems = [ // Declare mockItems here
          { empId: "1233", bankDetails: "Sample Bank Details 1" },
          { empId: "4567", bankDetails: "Sample Bank Details 2" },
        ];
      
        DynamoDBClient.prototype.send = async function (command) {
          // Simulate a successful scan operation with mock data
          return { Items: mockItems.map((item) => marshall(item)) };
        }
      
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


      it("should return an error response when an error occurs during the scan operation", async () => {
        DynamoDBClient.prototype.send = async function (command) {
          throw new Error("Scan operation failed");
        };
      
        const response = await getAllBanks();
      
        expect(response.statusCode).to.equal(500);
        expect(JSON.parse(response.body)).to.deep.equal({
          message: "Failed to retrieve posts.",
          errorMsg: "Scan operation failed", 
        });
      });
  });