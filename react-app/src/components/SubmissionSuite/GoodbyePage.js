import React from "react";
import { Link } from "react-router-dom";

const GoodbyePage = ({ submitterId }) => {
    return (
        <>
            <h2 id="thanks">Thank you for your submission!</h2>
            <p id="instructions">
                You can safely close this window, or
                <Link to={`/${submitterId}/submit`}>
                    <button style={{ margin: "5px" }}>
                        change and resubmit
                    </button>
                </Link>
            </p>
        </>
    );
};

export default GoodbyePage;
