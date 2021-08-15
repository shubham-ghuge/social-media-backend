function sanitizeResponse(response, ...fields) {
    fields.map((i) => response[i] = undefined)
    return response;
}
module.exports = { sanitizeResponse }