import React, { useEffect } from "react";
import SkipCheckBox from "./SkipCheckbox";

const Text = ({ prompt, required, data }) => {
    const skipping = data.complete === "opt-out";

    function handleChange(response) {
        data.complete = !required || response != "";
        data.response = response;
    }

    function setSkipping(value) {
        if (value) {
            data.complete = "opt-out";
            data.response = "";
        } else {
            data.complete = false;
        }
    }

    useEffect(() => {
        handleChange(data.response || "");
    });

    return (
        <>
            <p>{prompt}</p>
            <textarea
                onChange={(e) => handleChange(e.target.value)}
                value={data.response}
            />
            {required === "opt-out" && (
                <SkipCheckBox skipping={skipping} setSkipping={setSkipping} />
            )}
        </>
    );
};

export default Text;
