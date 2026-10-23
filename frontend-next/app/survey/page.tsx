'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SURVEY_STORAGE_KEY, surveyQuestions } from '@/lib/surveyQuestions';

export default function SurveyPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [radio, setRadio] = useState('');
  const [answers, setAnswers] = useState<Array<{ prompt: string; type: string; inputAnswer: string; multiselectAnswer: string }>>([]);
  const question = surveyQuestions[index];
  const isInput = question.type === 'input';

  const progressMax = surveyQuestions.length;
  const buttonLabel = useMemo(() => (index === progressMax - 1 ? 'Finish' : 'Next'), [index, progressMax]);

  function pushAnswer() {
    const next = [
      ...answers,
      {
        prompt: question.prompt,
        type: question.type,
        inputAnswer: isInput ? text : '',
        multiselectAnswer: isInput ? '' : radio
      }
    ];
    setAnswers(next);
    return next;
  }

  function nextQuestion() {
    if (isInput && !text) return;
    if (!isInput && !radio) return;
    const next = pushAnswer();
    if (index === progressMax - 1) {
      window.sessionStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(next));
      router.push('/createAccount');
      return;
    }
    setIndex(index + 1);
    setText('');
    setRadio('');
  }

  return (
    <div>
      <div className="surveyX">
        <h1 className="prompt">{question.prompt}</h1>
        {isInput ? (
          <input className="input b-textinput" type={question.input_type || 'text'} placeholder={String(question.placeholder || '')} value={text} onChange={(e) => setText(e.target.value)} />
        ) : (
          <div className="surveybox">
            <div className="box b-surveyform boxpad">
              {(question.options || []).map((option, optionIndex) => (
                <label key={option} htmlFor={`opt-${optionIndex}`}>
                  <div className="columns is-mobile b-surveycolumns" style={{ marginTop: '0.5rem' }}>
                    <div className="column b-surveycolumn">{option}</div>
                    <div className="column is-narrow b-surveycolumn">
                      <input id={`opt-${optionIndex}`} type="radio" name="form1" className="b-formradio" value={option} checked={radio === option} onChange={() => setRadio(option)} />
                    </div>
                  </div>
                  {optionIndex !== (question.options || []).length - 1 ? <div className="b-breaker" /> : null}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <progress className="progress progressbar is-primary" value={index + 1} max={progressMax} />
      <div className="undertext">{index + 1}/{progressMax}</div>
      <button className="button b-button next" onClick={nextQuestion}>{buttonLabel}</button>
      {index > 0 ? <div className="back" onClick={() => setIndex(index - 1)}>Go back a question</div> : null}
    </div>
  );
}
