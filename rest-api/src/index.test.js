const request = require('supertest');
const app = require('./index').test();
const { data } = require('./submissions');

describe('POST /api/v1/collector', (done) => {
    it('should collect a valid first submission', (done) => {
        expect(data).toEqual({});
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '123',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            })
            .expect(200)
            .expect({
                submitterId: '123',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            })
            .then(() => {
                expect(data).toEqual({
                    '123': [
                        {
                            answerToQuestion1: 'the first answer',
                            answerToQuestion2: 'the second answer',
                            answerToQuestion3: 'the third answer'
                        }
                    ]
                });
                done();
            });
    });
    it('should collect a valid submission with new submitterId', (done) => {
        expect(data).toEqual({
            '123': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            ]
        });
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '456',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            })
            .expect(200)
            .expect({
                submitterId: '456',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            })
            .then(() => {
                expect(data).toEqual({
                    '123': [
                        {
                            answerToQuestion1: 'the first answer',
                            answerToQuestion2: 'the second answer',
                            answerToQuestion3: 'the third answer'
                        }
                    ],
                    '456': [
                        {
                            answerToQuestion1: 'the first answer',
                            answerToQuestion2: 'the second answer',
                            answerToQuestion3: 'the third answer'
                        }
                    ]
                });
                done();
            });
    });
    it('should collect a valid submission', (done) => {
        expect(data).toEqual({
            '123': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            ],
            '456': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            ]
        });
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '456',
                submission: {
                    answerToQuestion1: 'another first answer',
                    answerToQuestion2: 'another second answer',
                    answerToQuestion3: 'another third answer'
                }
            })
            .expect(200)
            .expect({
                submitterId: '456',
                submission: {
                    answerToQuestion1: 'another first answer',
                    answerToQuestion2: 'another second answer',
                    answerToQuestion3: 'another third answer'
                }
            })
            .then(() => {
                expect(data).toEqual({
                    '123': [
                        {
                            answerToQuestion1: 'the first answer',
                            answerToQuestion2: 'the second answer',
                            answerToQuestion3: 'the third answer'
                        }
                    ],
                    '456': [
                        {
                            answerToQuestion1: 'the first answer',
                            answerToQuestion2: 'the second answer',
                            answerToQuestion3: 'the third answer'
                        },
                        {
                            answerToQuestion1: 'another first answer',
                            answerToQuestion2: 'another second answer',
                            answerToQuestion3: 'another third answer'
                        }
                    ]
                });
                done();
            });
    });
    it('should reject and warn about missing submitterId', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submitterId: 'string'
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about missing submission', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '123'
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submission: {
                        answerToQuestion1: 'string',
                        answerToQuestion2: 'string',
                        answerToQuestion3: 'string'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about missing submission fields', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '123',
                submission: {
                    answerToQuestion2: 'the second answer'
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submission: {
                        answerToQuestion1: 'string',
                        answerToQuestion3: 'string'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about extra submission fields', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '123',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer',
                    answerToNothing: 'an unrecognized answer'
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                rejectedFields: {
                    submission: {
                        answerToNothing: 'an unrecognized answer'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about missing and extra submission fields', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '123',
                submission: {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion3: 'the third answer',
                    answerToNothing: 'an unrecognized answer'
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submission: {
                        answerToQuestion2: 'string'
                    }
                },
                rejectedFields: {
                    submission: {
                        answerToNothing: 'an unrecognized answer'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about empty submission', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({})
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submitterId: 'string',
                    submission: {
                        answerToQuestion1: 'string',
                        answerToQuestion2: 'string',
                        answerToQuestion3: 'string'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about all unrecognized submission fields', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                bogusId: 'onetwothree',
                submission: {
                    answerToNothing: 'an unrecognized answer',
                    answerToNonsense: 'a bogus answer'
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submitterId: 'string',
                    submission: {
                        answerToQuestion1: 'string',
                        answerToQuestion2: 'string',
                        answerToQuestion3: 'string'
                    }
                },
                rejectedFields: {
                    bogusId: 'onetwothree',
                    submission: {
                        answerToNothing: 'an unrecognized answer',
                        answerToNonsense: 'a bogus answer'
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should reject and warn about incorrect data types', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: 123,
                submission: {
                    answerToQuestion1: ['one', 'two', 'three'],
                    answerToQuestion2: 321,
                    answerToQuestion3: {
                        property1: 1,
                        property2: '2'
                    }
                }
            })
            .expect(400)
            .expect({
                error: 'Missing or incorrect fields',
                requiredFields: {
                    submitterId: 'string',
                    submission: {
                        answerToQuestion1: 'string',
                        answerToQuestion2: 'string',
                        answerToQuestion3: 'string'
                    }
                },
                rejectedFields: {
                    submitterId: 123,
                    submission: {
                        answerToQuestion1: ['one', 'two', 'three'],
                        answerToQuestion2: 321,
                        answerToQuestion3: {
                            property1: 1,
                            property2: '2'
                        }
                    }
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
});

describe('POST /api/v1/results', () => {
    it('should release anonymized results for correct password', (done) => {
        const initialData = {
            '123': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            ],
            '456': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                },
                {
                    answerToQuestion1: 'another first answer',
                    answerToQuestion2: 'another second answer',
                    answerToQuestion3: 'another third answer'
                }
            ]
        };
        expect(data).toEqual(initialData);
        request(app)
            .post('/api/v1/results')
            .send({
                password: 'password'
            })
            .expect(200)
            .expect([
                [
                    {
                        answerToQuestion1: 'the first answer',
                        answerToQuestion2: 'the second answer',
                        answerToQuestion3: 'the third answer'
                    }
                ],
                [
                    {
                        answerToQuestion1: 'the first answer',
                        answerToQuestion2: 'the second answer',
                        answerToQuestion3: 'the third answer'
                    },
                    {
                        answerToQuestion1: 'another first answer',
                        answerToQuestion2: 'another second answer',
                        answerToQuestion3: 'another third answer'
                    }
                ]
            ])
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should include recent submissions', (done) => {
        expect(data).toEqual({
            '123': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                }
            ],
            '456': [
                {
                    answerToQuestion1: 'the first answer',
                    answerToQuestion2: 'the second answer',
                    answerToQuestion3: 'the third answer'
                },
                {
                    answerToQuestion1: 'another first answer',
                    answerToQuestion2: 'another second answer',
                    answerToQuestion3: 'another third answer'
                }
            ]
        });
        request(app)
            .post('/api/v1/collector')
            .send({
                submitterId: '789',
                submission: {
                    answerToQuestion1: 'whose first answer',
                    answerToQuestion2: 'whose second answer',
                    answerToQuestion3: 'whose third answer'
                }
            })
            .expect(200)
            .then(() => {
                request(app)
                    .post('/api/v1/results')
                    .send({
                        password: 'password'
                    })
                    .expect(200)
                    .expect([
                        [
                            {
                                answerToQuestion1: 'the first answer',
                                answerToQuestion2: 'the second answer',
                                answerToQuestion3: 'the third answer'
                            }
                        ],
                        [
                            {
                                answerToQuestion1: 'the first answer',
                                answerToQuestion2: 'the second answer',
                                answerToQuestion3: 'the third answer'
                            },
                            {
                                answerToQuestion1: 'another first answer',
                                answerToQuestion2: 'another second answer',
                                answerToQuestion3: 'another third answer'
                            }
                        ],
                        [
                            {
                                answerToQuestion1: 'whose first answer',
                                answerToQuestion2: 'whose second answer',
                                answerToQuestion3: 'whose third answer'
                            }
                        ]
                    ])
                    .then(() => {
                        expect(data).toEqual({
                            '123': [
                                {
                                    answerToQuestion1: 'the first answer',
                                    answerToQuestion2: 'the second answer',
                                    answerToQuestion3: 'the third answer'
                                }
                            ],
                            '456': [
                                {
                                    answerToQuestion1: 'the first answer',
                                    answerToQuestion2: 'the second answer',
                                    answerToQuestion3: 'the third answer'
                                },
                                {
                                    answerToQuestion1: 'another first answer',
                                    answerToQuestion2: 'another second answer',
                                    answerToQuestion3: 'another third answer'
                                }
                            ],
                            '789': [
                                {
                                    answerToQuestion1: 'whose first answer',
                                    answerToQuestion2: 'whose second answer',
                                    answerToQuestion3: 'whose third answer'
                                }
                            ]
                        });
                        done();
                    });
            });
    });
    it('should do nothing and reject incorrect password', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/results')
            .send({
                password: 'incorrect'
            })
            .expect(400)
            .expect({
                error: 'Incorrect password',
                requiredFields: {
                    password: 'string'
                },
                rejectedFields: {
                    password: 'incorrect'
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should do nothing and reject password with incorrect data type', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/results')
            .expect(400)
            .send({
                password: 123
            })
            .expect({
                error: 'Password must be a string',
                requiredFields: {
                    password: 'string'
                },
                rejectedFields: {
                    password: 123
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
    it('should do nothing and reject absent password', (done) => {
        const initialData = { ...data };
        request(app)
            .post('/api/v1/results')
            .expect(400)
            .expect({
                error: 'Missing password',
                requiredFields: {
                    password: 'string'
                }
            })
            .then(() => {
                expect(data).toEqual(initialData);
                done();
            });
    });
});
