export const convertToPgDate = (date: string | Date) => {
  return typeof date === "string"
    ? date.slice(0, 10)
    : date.toISOString().slice(0, 10);
};
