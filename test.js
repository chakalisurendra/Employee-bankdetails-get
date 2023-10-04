const { expect } = require("chai");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { getBankDetails } = require("./api"); // Import your Lambda function

// Store the original send method
const originalSend = DynamoDBClient.prototype.send;

DynamoDBClient.prototype.send = async function (command) {
  // Simulate a successful response here
  const mockItem = { empId: "1233", bankDetails: "Sample Bank Details" };
  return { Item: marshall(mockItem) };
};

describe("getBankDetails", () => {
  after(() => {
    // Restore the original send method
    DynamoDBClient.prototype.send = originalSend;
  });

  it("should return employee bank details", async () => {
    const event = {
      pathParameters: { empId: "1" },
    };

    const response = await getBankDetails(event);

    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.deep.equal({
      message: "Successfully retrieved Employee bank.",
      data: { empId: "1233", bankDetails: "Sample Bank Details" },
    });
  });

    it("should return an error when empId is missing", async () => {
      const event = {
        pathParameters: {},
      };
      const response = await getBankDetails(event);
      expect(response.statusCode).to.equal(500);
      // expect(JSON.parse(response.body)).to.deep.equal({
      //   message: "Failed to get employee bank details.",
      //   errorMsg: "empID is missing in the path parameters",
      // });
    });
});
