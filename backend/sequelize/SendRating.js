const QuestionScores = require("../sequelize/models/QuestionScores");
const SavedQuestions = require("../sequelize/models/SavedQuestions");
const QuestionChoices = require("../sequelize/models/QuestionChoices");
const { Sequelize } = require("sequelize");

const saveNewQuestion = async (question, choices) => {
  let savedQuestion;
  let created;
  try {
    [savedQuestion, created] = await SavedQuestions.findOrCreate({
      where: { question: `${question}` },
      defaults: { question_id: 0, question: question },
    });
  } catch (error) {
    if (error.message === "Validation error") {
      console.log(error);
    } else {
      console.log(
        "ERROR WITH SavedQuestions.findOrCreate LINE ~10",
        error.message
      );
    }
  }
  if (created) {
    try {
      await choices.falsies.forEach(async (choice) => {
        await QuestionChoices.create({
          id: 0,
          question_id: savedQuestion.dataValues.question_id,
          choice_data: choice.data,
          choice_country: choice.country,
          is_right_choice: false,
        });
      });
    } catch ({ message }) {
      console.log(
        "ERROR WITH QuestionChoices.create FALSIES LINE ~19",
        message
      );
    }
    try {
      await QuestionChoices.create({
        id: 0,
        question_id: savedQuestion.dataValues.question_id,
        choice_data: choices.rightChoice.data || choices.rightChoice,
        choice_country: choices.rightChoice.country || null,
        is_right_choice: true,
      });
    } catch ({ message }) {
      console.log(
        "ERROR WITH QuestionChoices.create RIGHTCHOICE LINE ~31",
        message
      );
    }
  }
  return savedQuestion;
};

const saveRating = async (rating, question, choices) => {
  let savedQuestion;
  try {
    savedQuestion = await saveNewQuestion(question, choices);
  } catch ({ message }) {
    console.log("ERROR WITH QUESTION CREATION ~line 36", message);
  }
  const getScore = (rating, check) => {
    if (rating === check) return rating;
  };
  try {
    await QuestionScores.create({
      id: 0,
      question_id: savedQuestion.dataValues.question_id,
      score_1: getScore(rating, 1),
      score_2: getScore(rating, 2),
      score_3: getScore(rating, 3),
      score_4: getScore(rating, 4),
      score_5: getScore(rating, 5),
    });
    return "OK";
  } catch ({ message }) {
    console.log("ERROR WITH SAVING SCORE: ~LINE 51", message);
    return "ERROR";
  }
};

module.exports = { saveRating };
