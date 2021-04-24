"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "QuestionTemplates",
      [
        {
          template: "How many people are living in",
          templateReqs: "none",
          templateAnsType: "pop_count",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "Which of the countries is the most crowded",
          templateReqs: "list",
          templateAnsType: "pop_count",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "Which of the following countries got it's autonomy first",
          templateReqs: "list",
          templateAnsType: "aut_date",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "Which is bigger in square kilometers - X or Y",
          templateReqs: "XY",
          templateAnsType: "size",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "What is the approximate size of X in square kilometers",
          templateReqs: "X",
          templateAnsType: "size",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template:
            "Which of the following countries has the highest deathrate",
          templateReqs: "list",
          templateAnsType: "deathrate",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "What is the approximate deathrate of X",
          templateReqs: "X",
          templateAnsType: "deathrate",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template:
            "Which of the following countries has the highest birthrate",
          templateReqs: "list",
          templateAnsType: "birthrate",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "What is the approximate birthrate of X",
          templateReqs: "X",
          templateAnsType: "birthrate",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "What is the capital of X",
          templateReqs: "Xlist",
          templateAnsType: "capital",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "X belongs to which of the following regions",
          templateReqs: "Xlist",
          templateAnsType: "region",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          template: "In what continent is X located",
          templateReqs: "Xlist",
          templateAnsType: "continent",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
