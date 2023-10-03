'use strict';
const { expect } = require('chai');
//const sinon = require('sinon');
//const AWSMock = require('aws-sdk-mock');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const api = require('./api'); // Replace with the actual path to your code

describe('getBankDetails function', function () {
    // afterEach(() => {
    //     AWSMock.restore();
    // });

    it('should retrieve bank details successfully', async function () {
        const expectedEmpId = '1'; // Replace with a valid empId for testing
        // const expectedData = {
        //     // Define your expected data here
        // };

        // // Mock the DynamoDBClient send method
        // AWSMock.mock('DynamoDBClient', 'send', (params) => {
        //     expect(params).to.deep.equal({
        //         TableName: 'YourTableName', // Replace with your actual table name
        //         Key: { empId: { S: expectedEmpId } },
        //     });

        //     // Return the expected data
        //     return { Item: expectedData };
        // });

        // Call the getBankDetails function with the expected empId
        const response = await api.getBankDetails({ pathParameters: { empId: expectedEmpId } });

        // Assertions
        expect(response.statusCode).to.equal(200);
        //const responseBody = JSON.parse(response.body);
        //expect(responseBody.message).to.equal('Successfully retrieved Employee bank details.');
        //expect(responseBody.data).to.deep.equal(expectedData);
    });
});





// var expect = require('chai').expect;

// var lambdaTester = require('lambda-tester');

// var api = require('./api');

// describe('get employee by empId unit test', function () {
//     let validEmpId = 1;
//     it(`successful invocation: empId= ${validEmpId}`, function () {
//         return lambdaTester(api.getBankDetails)
//             .event({ empId: validEmpId })
//             .expectResult((response) => {
//                 expect(response.statusCode).to.be.equals(200);
//             });
//     });
// });

// describe('get all employee by empId unit test', function () {
    
//     it(`successful invocation all employee`, function () {
//         return lambdaTester(api.getAllBanks)
//             .expectResult((response) => {
//                 expect(response.statusCode).to.be.equals(200);
//             });
//     });
// });



