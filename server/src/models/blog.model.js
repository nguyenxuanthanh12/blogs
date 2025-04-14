const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelBlog = new Schema(
    {
        content: { type: String, require: true },
        topic: { type: Schema.Types.ObjectId, ref: 'topic' },
        author: { type: Schema.Types.ObjectId, ref: 'user' },
        image: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('blog', modelBlog);
