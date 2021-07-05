// This module provides a template for verifying the structure of survey responses

const { DataType } = require('./formatObject');

const submissionFormat = {
    submitterId: DataType.string,
    submission: {
        answerToQuestion1: DataType.string,
        answerToQuestion2: DataType.string,
        answerToQuestion3: DataType.string
    }
};

module.exports = submissionFormat;
