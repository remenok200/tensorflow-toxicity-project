import React, { useState, useEffect } from 'react';
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs';
import styles from './ToxicityClassifier.module.css';

const ToxicityClassifier = () => {
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [result, setResult] = useState('The result will appear here');

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await toxicity.load(0.7, [
        'identity_attack',
        'insult',
        'obscene',
        'severe_toxicity',
        'sexual_explicit',
        'threat',
      ]);

      setModel(loadedModel);
      setIsLoading(false);
    };

    loadModel();
  }, []);

  const classifyComment = async () => {
    if (!comment.trim()) {
      setResult('Please enter comment to classify');
      return;
    }

    setIsProcessing(true);

    const predictions = await model.classify(comment);

    const classificationResults = [];

    predictions.forEach((prediction) => {
      const match = prediction.results[0].match;

      if (match) {
        classificationResults.push(prediction.label);
      }
    });

    setIsProcessing(false);

    if (classificationResults.length > 0) {
      setResult(
        `This text contains toxic content in categories ${classificationResults.join(
          ', '
        )}`
      );
    } else {
      setResult('This text does not contain toxic content.');
    }
  };

  if (isProcessing) {
    return <h1>Just a moment. Model is processing...</h1>;
  }

  const clearBtn = () => {
    setComment('');
    setResult('The result will appear here');
  };

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <h1>Please wait. Model is loading...</h1>
      ) : (
        <>
          <textarea
            value={comment}
            onChange={({ target: { value } }) => setComment(value)}
            placeholder="Enter your comment..."
            className={styles.textarea}
          />

          <button disabled={isProcessing} onClick={classifyComment}>
            Check comment
          </button>

          <button onClick={clearBtn}>Clear</button>

          <h3>{result}</h3>
        </>
      )}
    </div>
  );
};

export default ToxicityClassifier;
