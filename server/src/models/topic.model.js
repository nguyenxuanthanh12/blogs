const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelTopic = new Schema(
    {
        name: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('topic', modelTopic);
