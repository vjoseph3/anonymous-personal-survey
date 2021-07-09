import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Form = ({ submitForm }) => {
    const { submitterId } = useParams();
    const [answerToQuestion1, setAnswerToQuestion1] = useState('');
    const [answerToQuestion2, setAnswerToQuestion2] = useState('');
    const [answerToQuestion3, setAnswerToQuestion3] = useState('');

    function handleSubmit() {
        answerToQuestion1 && answerToQuestion2 && answerToQuestion3 &&
        submitForm(
            submitterId,
            {
                answerToQuestion1,
                answerToQuestion2,
                answerToQuestion3
            }
        );
    }
    return (
        <>
            <h2>This is user {submitterId}.</h2>
            <p>The form lives here...</p>
            <p>...with all the little questions.</p>
            <input type='text' onChange={event => setAnswerToQuestion1(event.target.value)} />
            <input type='text' onChange={event => setAnswerToQuestion2(event.target.value)} />
            <input type='text' onChange={event => setAnswerToQuestion3(event.target.value)} />
            <button onClick={handleSubmit}>Submit</button>
        </>
    );
};

export default Form;