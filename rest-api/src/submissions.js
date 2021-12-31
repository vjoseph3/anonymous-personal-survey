// This module provides tools to store the results of the survey

// A database object for storing the survey submissions
// Each property name is the ID of a submitter
// Each property value is the chronological list of submissions from that submitter
const data = {};

/**
 * Returns an anonymized record of all known submissions
 * @returns {Object[][]} - an array of the various lists of submissions
 */
function anonymize() {
    return Object.values(data);
}

/**
 * Copies a submission into the database
 * @param {Object} datum
 * @param {String} datum.submitterId - the ID under which to add the submission
 * @param {Object} datum.submission - the submission to add
 * @returns {Object} - the original parameter received
 */
function collect(datum) {
    const { submitterId, submission } = datum;
    if (data[submitterId] === undefined) {
        data[submitterId] = [];
    }
    data[submitterId].push({ ...submission });
    return datum;
}

module.exports = {
    data,
    anonymize,
    collect,
};
