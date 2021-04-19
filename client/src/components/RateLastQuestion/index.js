import React, { useState, useEffect } from "react";
import Rating from "material-ui-rating";
import { useSelector } from "react-redux";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/rating/ratequestion";

export default function RateQuestion() {
  const [rating, setRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const { question, answered, failed, choices } = useSelector((state) => state);

  const handleRating = async (e) => {
    setRating(e);
    const questionData = {
      rating: e,
      question: question,
      credibility: answered.answerCount - failed.failedCount,
      choices: choices,
    };
    await network.post(baseUrl, questionData);
    setUserHasRated(true);
  };

  useEffect(() => {
    setUserHasRated(false);
    setRating(0);
  }, [question, answered]);

  return (
    <div>
      {!userHasRated ? (
        <div className="rating-component">
          <p>Rate this question?</p>
          <Rating
            value={rating}
            max={5}
            onChange={(e) => {
              handleRating(e);
            }}
          />
        </div>
      ) : (
        <div className="rating-component">
          <p>Thank you for rating!</p>
          <Rating value={rating} max={5} />
        </div>
      )}
    </div>
  );
}
