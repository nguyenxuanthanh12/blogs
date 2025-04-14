const modelComment = require('../models/comment.model');

const { BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

class CommentController {
    async createComment(req, res) {
        const { id } = req.user;
        const { content, blog } = req.body;
        if (!content || !blog) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const comment = await modelComment.create({ content, blog, author: id });
        new Created({
            message: 'Tạo bình luận thành công',
            metadata: comment,
        }).send(res);
    }
}

module.exports = new CommentController();
