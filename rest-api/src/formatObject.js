// This module provides tools to check object structures and data types

class DataType {
    constructor(description, hasInstance) {

        // a human-readable definition
        this.description = description;

        // a function that checks if its parameter is of this data type
        this.hasInstance = hasInstance;
    }

    // some built-in data types
    static string = new DataType('string', val => typeof val === 'string');
}

/**
 * Returns the argument, or an empty object if the argument cannot be converted to an object
 * @example
 * // returns {}
 * objectify(null)
 * @example
 * // returns 'foo'
 * objectify('foo')
 * @param {Any} value
 * @returns {Any}
 */
function objectify(value) {
    try {
        Object.getOwnPropertyNames(value);
        return value;
    } catch {
        return {};
    }
}

/**
 * Counts how many properties the argument has
 * @example
 * // returns 0
 * countProperties(false)
 * @example
 * // returns 2
 * countProperties({ foo: 'foo', bar: 'bar' })
 * @param {Any} value
 * @returns {Number}
 */
function countProperties(value) {
    value = objectify(value);
    return Object.getOwnPropertyNames(value).length;
}

/**
 * Copies a property of one object to another, provided the first object has that property
 * @param {Any} object1 - the object whose property to copy
 * @param {String} propName1 - the property to copy
 * @param {Any} object2 - the object to receive the property
 * @param {String} [propName2=propName1] - the new name of the property
 */
function copyProperty(object1, propName1, object2, propName2) {
    if (!propName2) {
        propName2 = propName1;
    }
    if (object1.hasOwnProperty(propName1)) {
        object2[propName2] = object1[propName1];
    }
}

/**
 * Returns an object describing how candidate compares against template
 * @example
 * // returns {
 *     passed: false,
 *     requiredFields: {
 *         position: {
 *             x: 'number'
 *         },
 *         colour: 'string'
 *     },
 *     rejectedFields: {
 *         position: {
 *             x: '1'
 *         },
 *         nonsense: ['sdlfkj', 126.9]
 *     }
 * }
 * verify({
 *     position: {
 *         x: '1',
 *         y: 3
 *     },
 *     nonsense: ['sdlfkj', 126.9]
 * }).against({
 *     position: {
 *         x: new DataType('number', val => typeof val === 'number')
 *         y: new DataType('number', val => typeof val === 'number')
 *     },
 *     colour: new DataType('string', val => typeof val === 'string')
 * })
 * @param {Any} candidate - the object to be verified
 * @param {Object} template - an object tree with DataType leaves
 * @returns {Object}
 */
function checkFormatAgainst(candidate, template) {
    let requiredFields = {};
    let rejectedFields = {};
    let passed = true;

    candidate = objectify(candidate);

    // find extraneous properties of candidate
    Object.getOwnPropertyNames(candidate).forEach(propName => {
        if (!template[propName]) {
            passed = false;
            copyProperty(candidate, propName, rejectedFields);
        }
    });

    // check all properties of template
    Object.getOwnPropertyNames(template).forEach(propName => {
        const prop = template[propName];
        if (prop instanceof DataType) {
            // base case
            if (prop.hasInstance(candidate[propName]) == false) {
                passed = false;
                requiredFields[propName] = prop.description;
                copyProperty(candidate, propName, rejectedFields);
            }
        } else {
            // recursive case
            const propVerification = checkFormatAgainst(candidate[propName], template[propName]);
            if (propVerification.passed == false) {
                passed = false;
                copyProperty(propVerification, 'requiredFields', requiredFields, propName);
                copyProperty(propVerification, 'rejectedFields', rejectedFields, propName);
            }
        }
    });

    // collect findings
    let verification = { passed };
    if (countProperties(requiredFields) > 0) {
        verification.requiredFields = requiredFields;
    }
    if (countProperties(rejectedFields) > 0) {
        verification.rejectedFields = rejectedFields;
    }
    return verification;
}

function checkFormat(candidate) {
    return {
        against: (template) => checkFormatAgainst(candidate, template)
    };
}

module.exports = {
    DataType,
    checkFormat
}

