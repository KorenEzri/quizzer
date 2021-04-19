const SavedQuestions = require("../sequelize/models/SavedQuestions");

const getScore = (rating, check) => {
  return rating === check ? rating : null;
};
const saveRating = async (rating, question, choices, credibility) => {
  console.log(rating, "HERE");
  const falsyChoices = choices.falsies;
  try {
    const [savedQuestion, created] = await SavedQuestions.findOrCreate({
      where: { question_full: `${question}` },
      defaults: {
        question_id: 0,
        question_template: null,
        question_full: question,
        choice_1_country: falsyChoices[0].country,
        choice_1_data: falsyChoices[0].data,
        choice_2_country: falsyChoices[1].country,
        choice_2_data: falsyChoices[1].data,
        choice_3_country: falsyChoices[2].country,
        choice_3_data: falsyChoices[2].data,
        choice_correct_country: choices.rightChoice.country,
        choice_correct_data: choices.rightChoice.data || choices.rightChoice,
        score_1: getScore(rating, 1),
        score_2: getScore(rating, 2),
        score_3: getScore(rating, 3),
        score_4: getScore(rating, 4),
        score_5: getScore(rating, 5),
      },
    });
    if (!created) {
      savedQuestion.save();
    }
  } catch ({ message }) {
    console.log(message);
  }
};

module.exports = { saveRating };
