export const convertToPgDate = (date) => {
    return typeof date === "string"
        ? date.slice(0, 10)
        : date.toISOString().slice(0, 10);
};
//# sourceMappingURL=date.js.map