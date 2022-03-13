const { Schema, model } = require("mongoose");

const alreadySchema = Schema({
    messageId: String,
})

module.exports = model("Already", alreadySchema);