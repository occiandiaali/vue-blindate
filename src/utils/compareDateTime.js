function compareDateTime(inputDate) {
  const currentDate = new Date();
  const givenDate = new Date(inputDate);

  if (givenDate.getTime() < currentDate.getTime()) {
    return "The given date is earlier than the current date.";
  } else if (givenDate.getTime() > currentDate.getTime()) {
    return "The given date is later than the current date.";
  } else {
    return "The given date is the same as the current date.";
  }
}

//export default compareDateTime;

function isToday(date) {
  const today = new Date();

  // 👇️ Today's date
  //  console.log(today);

  if (today < date) {
    return true;
  }

  return false;
}

// let dateTimeString = "2025-09-06T14:30:00"; // ISO format
// let dateObject = new Date(dateTimeString);
// let dateTimeString = "2025-09-06T14:43:50"; // ISO format
// let dateObject = new Date(dateTimeString);
// console.log("dateObj: ", dateObject.toLocaleString());

// console.log(isToday(new Date())); // 👉️ true
// console.log(isToday(new Date("2025-10-10"))); // 👉️ false
// console.log("==================================");
// console.log(isToday(dateObject));
// const result = compareDateTime(dateObject);
// console.log("+++++++++++++++++++++++++++++++++++");
// console.log(result);

export { compareDateTime, isToday };
