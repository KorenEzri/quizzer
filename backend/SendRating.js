const sequelize = require("./sequelize");
const DataTypes = require("sequelize/lib/data-types");
const SavedQuestions = require("./models/questions")(sequelize, DataTypes);
const AnonUsers = require("./models/AnonUsers")(sequelize, DataTypes);
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
          concatinatedScore: rawScore,
          concatinatedScoreWithRates: scoreWithRates,
          finalScore: scoreWithRates / rawScore,
        },
        {
          where: {
            questionFull: `${question}`,
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
          concatinatedScore: `+${rawScore}`,
          concatinatedScoreWithRates: `+${scoreWithRates}`,
          finalScore: `+${scoreWithRates / rawScore}`,
        },
        {
          where: {
            questionFull: `${question}`,
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
        lastRating: rating,
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
      where: { questionFull: `${question}` },
      defaults: {
        id: 0,
        questionTemplate: null,
        questionFull: question,
        choiceOneCountry: falsyChoices[0].country || null,
        choiceOneData: falsyChoices[0].data || falsyChoices[0],
        choiceTwoCountry: falsyChoices[1] ? falsyChoices[1].country : null,
        choiceTwoData: falsyChoices[1]
          ? falsyChoices[1].data
          : falsyChoices[1] || null,
        choiceThreeCountry: falsyChoices[2] ? falsyChoices[2].country : null,
        choiceThreeData: falsyChoices[2]
          ? falsyChoices[2].data
          : falsyChoices[2] || null,
        choiceCorrectCountry: choices.rightChoice.country,
        choiceCorrectData: choices.rightChoice
          ? choices.rightChoice.data
          : choices.rightChoice,
        scoreOne: getScore(rating, credibility, 1),
        scoreTwo: getScore(rating, credibility, 2),
        scoreThree: getScore(rating, credibility, 3),
        scoreFour: getScore(rating, credibility, 4),
        scoreFive: getScore(rating, credibility, 5),
        lastRatedBy: `${name}`,
        lastRating: rating,
        questionType: fullQuestion.question_type,
      },
    });
    if (!created) {
      const {
        dataValues: { concatinatedScore, concatinatedScoreWithRates },
      } = savedQuestion;
      rawScore = concatinatedScore + currentPlayerFS;
      scoreWithRates = concatinatedScoreWithRates + rating * currentPlayerFS;
      savedQuestion.concatinatedScore = rawScore;
      savedQuestion.concatinatedScoreWithRates = scoreWithRates;
      savedQuestion.finalScore = scoreWithRates / rawScore;
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
