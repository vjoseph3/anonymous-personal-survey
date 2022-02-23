import React from "react";

const SkipCheckbox = ({ skipping, setSkipping }) => {
    return (
        <div style={{ fontSize: "12px" }}>
            <label style={{ verticalAlign: "middle" }}>
                <input
                    type="checkbox"
                    defaultChecked={skipping}
                    onClick={(e) => setSkipping(e.target.checked)}
                    style={{ verticalAlign: "middle" }}
                />
                Skip this question
            </label>
        </div>
    );
};

export default SkipCheckbox;
