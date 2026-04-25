export const toCamelCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map((v) => toCamelCase(v));
    }
    else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replaceAll(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
};
//# sourceMappingURL=formatters.js.map