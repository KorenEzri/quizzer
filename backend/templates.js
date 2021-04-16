const templates = {
  question_headings: [
    `How many`,
    `How much`,
    `Which`,
    `What is`,
    `When did the`,
    `When was`,
    `is`,
  ],
  question_subjects: {
    how_many_subjects: [`people`, `countries`, `states`, ``],
    how_much_subjects: [`time did`, ``],
    which_subjects: [
      `is the busiest`,
      `country is`,
      `city is`,
      `state is`,
      `person is`,
      `person was`,
      `of the countries is`,
    ],
    what_is_subjects: [
      `the biggest`,
      `the smallest`,
      `the capital of`,
      `the primary language of`,
    ],
    when_did_subjects: [`covid outbreak happen`, ``],
    when_was_subjects: [`${country_name} founded?`, `${law_title} established`],
    is_subjects: [`${country_name} bigger than ${country_name}`],
  },
  question_tails: {
    how_many_tails: {
      people: [
        `are living in ${country_name}`,
        `are living in the city ${city_name}, ${country_name || state_name}`,
        ``,
      ],
      countries: [
        `are there in ${continent_name}`,
        `fought in ${war_name}`,
        `were formed between the years ${random_year_range}`,
      ],
      states: [
        `are there in ${country_name}`,
        `were formed between the years ${random_year_range}`,
      ],
    },
    how_much_tails: {
      time_did: [
        `${war_name} last?`,
        `it take for ${country_name} to get autonomy?`,
      ],
    },
    which_tails: {
      is_the_busiest: [
        `time of year in ${country_name}`,
        `season in ${country_name}`,
        `time for ${tourist_activity} in ${country_name}`,
      ],
    },
  },
};
