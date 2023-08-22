/* HTML elements */
/* input section */

function init() {
  /* main HTMl elements */
  const user_input_sections = document.querySelectorAll(
    "#input-sect .input-date"
  );
  const day_div = document.querySelector("#day-div");
  const month_div = document.querySelector("#month-div");
  const year_div = document.querySelector("#year-div");
  const button_result = document.querySelector(".btn");
  const years_result = document.querySelector("#years-result");
  const months_result = document.querySelector("#months-result");
  const days_result = document.querySelector("#days-result");

  /* states */
  const input_states = {
    day: {
      value: 0,
      valid: false,
      div_element: day_div,
    },

    month: {
      value: 0,
      valid: false,
      div_element: month_div,
    },

    year: {
      value: 0,
      valid: false,
      div_element: year_div,
    },
  };

  const result_states = {
    years: "--",
    months: "--",
    days: "--",
  };

  /* input on change */
  user_input_sections.forEach((input) => {
    input.addEventListener("input", () => {
      const date_element = input.dataset.type;
      const user_input_value = input.value;
      input_states[date_element].value = Number(user_input_value);
    });
  });

  /* button functionality */
  button_result.addEventListener("click", () => {
    checkDate();
  });

  function checkDate() {
    resetInvalidMessages();
    const today_date = new Date();

    input_states.year.valid = validateYear(
      input_states.year.value,
      today_date.getFullYear()
    ); /* Must be a previous year */
    input_states.month.valid = validateMonth(
      input_states.month.value
    ); /* Value must be between 1 and 12 */
    input_states.day.valid = validateDayNumber(
      input_states.day.value
    ); /* Value must be between 1 and 31 */

    if (
      input_states.year.valid &&
      input_states.month.valid &&
      input_states.day.valid
    ) {
      const user_date = new Date(
        input_states.year.value,
        input_states.month.value - 1,
        input_states.day.value
      );

      const is_valid_date = validateDate(
        user_date,
        today_date
      ); /* Must be a correct date */

      if (is_valid_date) {
        calculateAge(user_date, today_date);
        showDifference(
          result_states.years,
          result_states.months,
          result_states.days
        );
        return 0;
      }
    }

    console.log(input_states);

    showInvalidMessage();
    const default_result = "--";
    showDifference(default_result, default_result, default_result);
    return 1;
  }

  function validateYear(user_year, today_year) {
    return true
      ? user_year < today_year && user_year >= 1900 && user_year != undefined
      : false;
  }

  function validateMonth(user_month) {
    return true ? user_month >= 1 && user_month <= 12 : false;
  }

  function validateDayNumber(user_day) {
    return true ? user_day >= 1 && user_day <= 31 : false;
  }

  function validateDate(user_date, today_date) {
    /* If date is in the future, the difference in miliseconds is negative */
    if (today_date - user_date < 0) {
      return false;
    }
    /* if user had input a invalid date, the date constructor will create a date different to the user input values */
    return (
      user_date.getDate() === input_states.day.value &&
      user_date.getMonth() === input_states.month.value - 1
    );
  }

  function calculateAge(user_date, today_date) {
    const timeDifference = today_date - user_date;
    const days_difference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const months_difference = Math.floor((days_difference % 365) / 30);
    const years_difference = Math.floor(days_difference / 365);
    const remaining_days =
      days_difference - (years_difference * 365 + months_difference * 30);

    result_states.years = String(years_difference);
    result_states.months = String(months_difference);
    result_states.days = String(remaining_days);
  }

  function showDifference(result_year, result_month, result_day) {
    years_result.innerHTML = result_year;
    months_result.innerHTML = result_month;
    days_result.innerHTML = result_day;
  }

  function resetInvalidMessages() {
    const invalid_divs = document.querySelectorAll(".invalid");
    invalid_divs.forEach((div) => {
      div.classList.replace("invalid", "valid");
    });
  }

  function showInvalidMessage() {
    const field_required_message = "This field is required";
    const invalid_date_value = "Must be a valid";
    const invalid_date_past = "Must be a valid date";
    const invalid_date_too_past = "Must be at least from 1901";

    let invalid_date_counter = 0;

    for (const key in input_states) {
      if (input_states.hasOwnProperty(key)) {
        const date_element = key;
        const date_value = input_states[date_element].value;
        const date_validation = input_states[date_element].valid;
        const corresponding_element = input_states[date_element].div_element;
        const message_element =
          corresponding_element.querySelector(".invalid-label");

        /* If input value is 0 then show field required */
        if (!date_value) {
          setToInvalid(corresponding_element);
          setInvalidMessage(message_element, field_required_message);
        } else {
          /* If input value is not 0, then show that the input has an invalid value*/
          if (date_element === "day" && !date_validation) {
            setToInvalid(corresponding_element);
            setInvalidMessage(
              message_element,
              `${invalid_date_value} ${date_element}`
            );
          } else if (date_element === "month" && !date_validation) {
            setToInvalid(corresponding_element);
            setInvalidMessage(
              message_element,
              `${invalid_date_value} ${date_element}`
            );
          } else if (date_element === "year" && !date_validation) {
            setToInvalid(corresponding_element);
            if (date_value < 1900) {
              setInvalidMessage(message_element, invalid_date_too_past);
            } else {
              setInvalidMessage(message_element, invalid_date_past);
            }
          }
        }
        /* If everything was valid, then the whole date is invalid*/
        if (date_validation) {
          invalid_date_counter++;
          console.log(invalid_date_counter);
        }
      }
    }

    if (invalid_date_counter === 3) {
      day_div.classList.replace("valid", "invalid");
      month_div.classList.replace("valid", "invalid");
      year_div.classList.replace("valid", "invalid");
      setInvalidMessage(
        day_div.querySelector(".invalid-label"),
        "Invalid date"
      );
    }
  }

  function setToInvalid(element) {
    element.classList.replace("valid", "invalid");
  }

  function setInvalidMessage(element, message) {
    element.innerHTML = message;
  }
}

window.onload = init();
