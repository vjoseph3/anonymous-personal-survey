import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SubmissionSuite from "./components/SubmissionSuite";
import NotFoundPage from "./components/NotFoundPage";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/:submitterId">
                    <SubmissionSuite />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
