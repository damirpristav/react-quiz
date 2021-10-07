import React, { useState, useEffect, useRef } from 'react';

const Question = ({ data, answers, onAnswerUpdate, numberOfQuestions, activeQuestion, onSetActiveQuestion, onSetStep }) => {
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const radiosWrapper = useRef();

  useEffect(() => {
    const findCheckedInput = radiosWrapper.current.querySelector('input:checked');
    if(findCheckedInput) {
      findCheckedInput.checked = false;
    }
  }, [data]);

  // Check if already answered and if so set selected answer
  useEffect(() => {
    if(answers[activeQuestion] && !selected) {
      setSelected(answers[activeQuestion].a)
    }
  }, [activeQuestion, answers, selected])

  // Change handler
  const changeHandler = (e) => {
    setSelected(e.target.value);
    if(error) {
      setError('');
    }
  }
  
  // On next button click
  const nextClickHandler = (e) => {
    if(selected === '') {
      return setError('Please select one option!');
    }
    setSelected('');
    // Check if question already answered, if yes then update answer
    if(answers[activeQuestion]) {
      onAnswerUpdate(prevState => prevState.map((answer,i) => i === activeQuestion ? { ...answer, a: selected } : answer ))
    }else { // else add new answer to answers array
      onAnswerUpdate(prevState => [...prevState, { q: data.question, a: selected }]);
    }
    if(activeQuestion < numberOfQuestions - 1) {
      onSetActiveQuestion(activeQuestion + 1);
    }else {
      onSetStep(3);
    }
  }

  // On previuos button click
  const prevClickHandler = (e) => {
    setError('')
    setSelected('')
    if(activeQuestion > 0) {
      onSetActiveQuestion(activeQuestion - 1);
    }
  }

  return(
    <div className="card">
      <div className="card-content">
        <div className="content">
          <h2 className="mb-5">{data.question}</h2>
          <div className="control" ref={radiosWrapper}>
            {data.choices.map((choice, i) => (
              <label className="radio has-background-light" key={i}>
                <input type="radio" name="answer" value={choice} onChange={changeHandler} checked={choice === selected} />
                {choice}
              </label>
            ))}
          </div>
          {error && <div className="has-text-danger">{error}</div>}
          <div className="actions mt-4 is-flex is-justify-content-space-between">
            {activeQuestion > 0 && <button className="button is-warning is-light is-medium is-fullwidth mr-2" onClick={prevClickHandler}>Previous</button>}
            <button className="button is-link is-medium is-fullwidth" onClick={nextClickHandler}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;