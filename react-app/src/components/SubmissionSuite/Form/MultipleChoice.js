import React, { useState, useEffect } from "react";
import SkipCheckBox from "./SkipCheckbox";

const MultipleChoice = ({ prompt, choices, required, data }) => {
    const [response, setResponse] = useState(data.response);
    const skipping = data.complete === "opt-out";

    function handleChoice(choice) {
        data.complete = !required || choice != "";
        data.response = choice;
        setResponse(choice);
    }

    function setSkipping(value) {
        if (value) {
            data.complete = "opt-out";
            data.response = "";
        } else {
            data.complete = false;
        }
        setResponse("");
    }

    useEffect(() => {
        handleChoice(data.response || "");
    });

    function createButton(choice) {
        const isSelected = data.response === choice;
        return (
            <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className={isSelected ? "button selected" : "button deselected"}
                style={{
                    display: "inline-block",
                    textAlign: "center",
                    borderRadius: "3px",
                    border: "1px double",
                    margin: 3 - (isSelected && 2) + "px",
                    padding: 2 + (isSelected && 2) + "px",
                    minWidth: 115 + (isSelected && 4) + "px",
                    backgroundColor: isSelected && "#9df",
                }}
            >
                <span>{choice}</span>
            </button>
        );
    }

    return (
        <>
            <p>{prompt}</p>
            {choices.map((choice) => createButton(choice))}
            {required === "opt-out" && (
                <SkipCheckBox skipping={skipping} setSkipping={setSkipping} />
            )}
        </>
    );
};

export default MultipleChoice;
