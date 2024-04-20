import moment from "moment";

export const relativeTime = (time: string) => {
  time = moment(time).startOf("second").fromNow();

  return time
    .replace(
      /(\d+)\s*(minute?|hour?|day?|week?|month?|year?)s?/,
      (match, p1, p2) => {
        switch (p2) {
          case "minute":
            return p1 + "m";
          case "hour":
            return p1 + "h";
          case "day":
            return p1 + "d";
          case "week":
            return p1 + "w";
          case "month":
            return p1 + "M";
          case "year":
            return p1 + "y";
          default:
            return match;
        }
      },
    )
    .replace(" ago", "");
};
