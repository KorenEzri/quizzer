const SavedQuestions = require("../sequelize/models/SavedQuestions");
const AnonUsers = require("./models/AnonUsers");
const allRatingReqs = [];
let tag = false;
const getScore = (rating, credibility, check) => {
  if (rating === check) {
    const calculatedRating = calculateCredibility(rating, credibility);
    return calculatedRating;
  } else {
    return null;
  }
};
const calculateCredibility = (rating, credibility) => {
  const { credibilityPoints, timeElapsed } = credibility;
};
const updateQuestionScorings = async (
  rawScore,
  scoreWithRates,
  question,
  isNew
) => {
  if (isNew) {
    try {
      SavedQuestions.update(
        {
          concatinated_score: rawScore,
          concatinated_score_with_rates: scoreWithRates,
          final_score: scoreWithRates / rawScore,
        },
        {
          where: {
            question_full: `${question}`,
          },
        }
      );
    } catch ({ message }) {
      console.log(
        "ERROR in updatedQuestionScorings() at SendRating.js at ~line 16"
      );
    }
  } else {
    try {
      SavedQuestions.increment(
        {
          concatinated_score: `+${rawScore}`,
          concatinated_score_with_rates: `+${scoreWithRates}`,
          final_score: `+${scoreWithRates / rawScore}`,
        },
        {
          where: {
            question_full: `${question}`,
          },
        }
      );
    } catch ({ message }) {
      console.log(
        "ERROR in updatedQuestionScorings() at SendRating.js at ~line 23"
      );
    }
  }
};
const receieveRatingRequest = (
  rating,
  fullQuestion,
  credibility,
  name,
  gameEnd
) => {
  if (gameEnd) {
    console.log("RECEIVED RATING CLEANUP REQUEST, RATING CAHCE CLEARED");
    allRatingReqs.length = 0;
    tag = false;
    return "OK";
  }
  const ratingRequest = {
    rating,
    fullQuestion,
    credibility,
    name,
  };
  allRatingReqs.push(ratingRequest);
  console.log("RATING CACHE REQUEST RECEIVED AND SAVED");
};
const triggerRatingSequence = async (currentPlayerFS) => {
  if (allRatingReqs.length === 0 || tag) {
    return "OK";
  }
  tag = true;
  try {
    console.log(
      `Performing sequence on ${allRatingReqs.length} rating requests..`
    );
    await Promise.all(
      allRatingReqs.map(async (request, index) => {
        console.log(`At request #${index + 1}, by the user ${request.name}`);
        const { rating, fullQuestion, credibility, name } = request;
        try {
          await saveRatings(
            rating,
            fullQuestion,
            credibility,
            name,
            currentPlayerFS
          );
          console.log(`request #${index + 1} succeeded`);
        } catch ({ message }) {
          console.log(
            "ERROR WITH Promise.all inside triggerRatingSequence() at SendRating.js at ~line 56"
          );
        }
      })
    );
    return "OK";
  } catch ({ message }) {
    console.log(
      "ERROR WITH triggerRatingSequence() at SendRating.js at ~line 44",
      message
    );
    return "ERROR";
  }
};
const saveRatings = async (
  rating,
  fullQuestion,
  credibility,
  name,
  currentPlayerFS
) => {
  const { question, choices } = fullQuestion;
  const falsyChoices = choices.falsies;
  let rawScore;
  let scoreWithRates;
  try {
    AnonUsers.update(
      {
        last_rating: rating,
      },
      {
        where: {
          name: `${name}`,
        },
      }
    );
  } catch ({ message }) {
    console.log("ERROR with saveRating(), SendRating.js line ~23", message);
  }

  try {
    const [savedQuestion, created] = await SavedQuestions.findOrCreate({
      where: { question_full: `${question}` },
      defaults: {
        question_id: 0,
        question_template: null,
        question_full: question,
        choice_1_country: falsyChoices[0].country || null,
        choice_1_data: falsyChoices[0].data || falsyChoices[0],
        choice_2_country: falsyChoices[1] ? falsyChoices[1].country : null,
        choice_2_data: falsyChoices[1]
          ? falsyChoices[1].data
          : falsyChoices[1] || null,
        choice_3_country: falsyChoices[2] ? falsyChoices[2].country : null,
        choice_3_data: falsyChoices[2]
          ? falsyChoices[2].data
          : falsyChoices[2] || null,
        choice_correct_country: choices.rightChoice.country,
        choice_correct_data: choices.rightChoice
          ? choices.rightChoice.data
          : choices.rightChoice,
        score_1: getScore(rating, credibility, 1),
        score_2: getScore(rating, credibility, 2),
        score_3: getScore(rating, credibility, 3),
        score_4: getScore(rating, credibility, 4),
        score_5: getScore(rating, credibility, 5),
        last_rated_by: `${name}`,
        last_rating: rating,
        question_type: fullQuestion.question_type,
      },
    });
    if (!created) {
      const {
        dataValues: { concatinated_score, concatinated_score_with_rates },
      } = savedQuestion;
      rawScore = concatinated_score + currentPlayerFS;
      scoreWithRates = concatinated_score_with_rates + rating * currentPlayerFS;
      savedQuestion.concatinated_score = rawScore;
      savedQuestion.concatinated_score_with_rates = scoreWithRates;
      savedQuestion.final_score = scoreWithRates / rawScore;
      try {
        await savedQuestion.save();
      } catch ({ message }) {
        console.log(
          "ERROR SAVING ALREADT CREATED QUESTION AT SendRating.js at ~line 154",
          message
        );
      }
    } else {
      rawScore = currentPlayerFS;
      scoreWithRates = currentPlayerFS * rating;
      await updateQuestionScorings(rawScore, scoreWithRates, question, "isNew");
    }
  } catch ({ message }) {
    console.log(
      "ERROR WITH saveRatings() at SendRating.js at ~line 122",
      message
    );
  }
};

module.exports = { receieveRatingRequest, triggerRatingSequence };
