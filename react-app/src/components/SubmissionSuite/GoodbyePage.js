import React from "react";
import { FRONTEND_URL } from "../../constants";

const GoodbyePage = ({ submitterId }) => {
    const resubmitUrl = `${FRONTEND_URL}/${submitterId}/submit`;
    return (
        <>
            <h2 id="thanks">Thank you for your submission!</h2>
            <p id="instructions">
                You can update your submission at any time at {}
                <a href={resubmitUrl}>{resubmitUrl}</a>
            </p>
        </>
    );
};

export default GoodbyePage;
