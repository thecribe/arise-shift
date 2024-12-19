import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs with custom parsing
dayjs.extend(customParseFormat);
const format = "DD-MMM-YY h:mm A";

export const extractClockInTime = (date, shiftTime) => {
  // Split the string at the hyphen and take the first part

  let startTime = shiftTime.split(" - ")[0].trim();

  const mergeDateandTime =
    date.replace(/\s+/g, " ").replaceAll(" ", "-") + " " + startTime;

  const newDate = dayjs(mergeDateandTime, format).toDate(); // Convert to Date object

  return newDate;
};

// export const getDateObject()
export const setClockInTimeOne = (date, variation) => {
  let newDate = dayjs(date);

  // Generate a random number between -5 and 5
  let randomNum = Math.floor(Math.random() * (variation * 2 + 1)) - variation;

  if (randomNum < 0) {
    let dateSub = newDate.subtract(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  } else {
    let dateSub = newDate.add(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  }
};

export const setClockInTimeTwo = (date, variation) => {
  const newDate = dayjs(date, format).toDate();

  const newDate2 = dayjs(newDate);

  // Generate a random number between -5 and 5
  let randomNum = Math.floor(Math.random() * (variation * 2 + 1)) - variation;

  if (randomNum < 0) {
    let dateSub = newDate2.subtract(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  } else {
    let dateSub = newDate2.add(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  }
};

export const setClockOutTimeOne = (date, duration) => {
  const newDate = dayjs(date, format).toDate();
  const clockinTime = dayjs(newDate);

  let randomNum = Math.floor(Math.random() * 5) + 5;

  let dateSub = clockinTime.add(randomNum + duration, "minute");
  return dateSub.format(format);
};

export const setClockOutTimeTwo = (date, variation) => {
  const newDate = dayjs(date, format).toDate();
  const clockOutTime = dayjs(newDate);

  let randomNum = Math.floor(Math.random() * (variation * 2 + 1)) - variation;

  if (randomNum < 0) {
    let dateSub = clockOutTime.subtract(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  } else {
    let dateSub = clockOutTime.add(Math.abs(randomNum), "minute");
    return dateSub.format(format);
  }
};
