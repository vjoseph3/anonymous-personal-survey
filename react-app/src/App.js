import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Form from "./components/form";
import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/v1";

/**
 * Submits the form to the REST API
 * @param {String} submitterId - an identifier of who is submitting the form
 * @param {Object} submission - the submission
 * @returns {Boolean} - whether it was successful
 */
async function submitForm(submitterId, submission) {
    await fetch(`${API_URL}/collector`, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ submitterId, submission }),
    });
}

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/submit/:submitterId">
                    <Form submitForm={submitForm} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
