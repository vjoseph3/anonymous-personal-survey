import { useState, useEffect } from "react";
import { Switch, Route, useParams } from "react-router-dom";
import Form from "./Form";
import GoodbyePage from "./GoodbyePage";
import NotFoundPage from "../NotFoundPage";
import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/v1";

/**
 * Submits the form to the REST API
 * @param {String} submitterId - an identifier of who is submitting the form
 * @param {Object} submission - the submission
 * @returns {Boolean} - whether it was successful
 */
async function submitForm(data) {
    await fetch(`${API_URL}/collector`, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
    });
}

function SubmissionSuite() {
    const [data, setData] = useState({ submission: {} });
    useEffect(() => {
        if (data.submitterId) {
            submitForm(data);
        }
    }, [data]);
    const { submitterId } = useParams();
    return (
        <Switch>
            <Route path={`/${submitterId}/submit`}>
                <h2>Form</h2>
                <Form submitterId={submitterId} data={data} setData={setData} />
            </Route>
            <Route path={`/${submitterId}/goodbye`}>
                <h2>Goodbye</h2>
                <GoodbyePage submitterId={submitterId} />
            </Route>
            <Route>
                <h2>Not Found Second Level</h2>
                <NotFoundPage />
            </Route>
        </Switch>
    );
}

export default SubmissionSuite;
