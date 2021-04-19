import React, { useState } from "react";
import Rating from "material-ui-rating";
import { useSelector, useDispatch } from "react-redux";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/rating/ratequestion";

export default function RateQuestion() {
  const [rating, setRating] = useState(0);
  const { question } = useSelector((state) => state);
  const { answered } = useSelector((state) => state);
  const { failed } = useSelector((state) => state);
  const { choices } = useSelector((state) => state);
  const handleRating = async (e) => {
    setRating(e);
    await network.post(baseUrl, {
      rating: e,
      question: question,
      credibility: answered.answerCount - failed.failedCount,
      choices: choices,
    });
    setRating(0);
  };
  return (
    <div className="rating-component">
      <Rating
        value={rating}
        max={5}
        onChange={(e) => {
          handleRating(e);
        }}
      />
    </div>
  );
}
