import React from "react";
import Rating from "material-ui-rating";

export default function RateQuestion() {
  return (
    <div className="rating-component">
      <Rating
        value={0}
        max={5}
        onChange={(value) => console.log(`Rated with value ${value}`)}
      />
    </div>
  );
}
