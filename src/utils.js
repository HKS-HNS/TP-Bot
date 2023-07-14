/**
 * Checks if a string is a valid UUID.
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a valid UUID, false otherwise.
 */
function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

module.exports = {
    isUUID
};
