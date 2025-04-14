const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelComment = new Schema(
    {
        content: { type: String, require: true },
        blog: { type: Schema.Types.ObjectId, ref: 'blog' },
        author: { type: Schema.Types.ObjectId, ref: 'user' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('comment', modelComment);
