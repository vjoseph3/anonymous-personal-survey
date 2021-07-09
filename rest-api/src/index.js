const express = require('express');
const cors = require('cors');
const submissions = require('./submissions');
const { checkFormat } = require('./formatObject');
const { submissionFormat, retrievalFormat } = require('./formats');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/v1/collector', (req, res) => {
    const verification = checkFormat(req.body).against(submissionFormat);
    if (verification.passed === false) {
        delete verification.passed; // exclude from returned object
        return res.status(400).json({
            error: 'Missing or incorrect fields',
            ...verification
        });
    } else {
        const collected = submissions.collect(req.body);
        return res.json(collected).status(200);
    }
});

app.post('/api/v1/results', (req, res) => {
    const verification = checkFormat(req.body).against(retrievalFormat);
    if (verification.passed === false) {
        delete verification.passed; // exclude from returned object
        let error = 'Missing password';
        if (req.body.password) {
            error = 'Password must be a string';
            if (typeof req.body.password === 'string') {
                error = 'Incorrect password';
            }
        }
        return res.status(400).json({
            error,
            ...verification
        });
    } else {
        const results = submissions.anonymize();
        return res.json(results).status(200);
    }
});

// preparation for export

app.isTesting = false; // default value

// option to test on import
app.test = () => {
    app.isTesting = true;
    return app;
};

// wait until app.test() has been called or not
setTimeout(listenUnlessTesting, 1);

function listenUnlessTesting() {
    if (!app.isTesting) {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
}

// require('index.js').test() for testing
module.exports = app;
