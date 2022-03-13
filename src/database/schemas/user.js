const { Schema, model } = require("mongoose");

const userSchema = Schema({
    userId: String,
    coins: Number,
    cooldown: Number,
    profit: Number,
    bought: Number
})

module.exports = model("User", userSchema);