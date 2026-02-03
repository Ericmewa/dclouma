import dayjs from "dayjs";

export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "-";
  return dayjs(date).format(format);
};

export const formatDateTime = (date, format = "DD/MM/YYYY HH:mm:ss") => {
  if (!date) return "-";
  return dayjs(date).format(format);
};

export const isDateExpired = (date) => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), "day");
};
