// This module provides a template for verifying the structure of survey responses

const { DataType } = require("./formatObject");
const authenticate = require("./authenticate");

const submissionFormat = {
    submitterId: DataType.string,
    submission: {
        answerToQuestion1: DataType.string,
        answerToQuestion2: DataType.string,
        answerToQuestion3: DataType.string,
    },
};

const retrievalFormat = {
    password: new DataType("string", (val) => {
        return typeof val === "string" && authenticate(val);
    }),
};

module.exports = {
    submissionFormat,
    retrievalFormat,
};
