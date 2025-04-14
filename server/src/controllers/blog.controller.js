const modelBlog = require('../models/blog.model');
const modelTopic = require('../models/topic.model');
const modelUser = require('../models/users.model');
const modelComment = require('../models/comment.model');

const { OK, Created } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

require('dotenv').config();
class BlogController {
    async createBlog(req, res) {
        const { id } = req.user;

        const file = req.file;
        if (!file) {
            throw new BadRequestError('Vui lòng upload ảnh');
        }

        const { content, topic } = req.body;
        if (!content || !topic) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }

        const dataTopic = await modelTopic.findById(topic);
        if (!dataTopic) {
            throw new BadRequestError('Chủ đề không tồn tại');
        }

        const blog = await modelBlog.create({
            content,
            topic,
            author: id,
            image: `${process.env.CLIENT_URL}/uploads/images/${file.filename}`,
        });
        new Created({ message: 'Tạo bài viết thành công', metadata: blog }).send(res);
    }

    async getAllBlog(req, res) {
        const { idTopic } = req.query;
        const blogs = await modelBlog.find({ topic: idTopic });
        const data = await Promise.all(
            blogs.map(async (blog) => {
                const user = await modelUser.findById(blog.author);
                const comments = await modelComment.find({ blog: blog._id });
                const dataComment = await Promise.all(
                    comments.map(async (comment) => {
                        const user = await modelUser.findById(comment.author);
                        return {
                            ...comment._doc,
                            author: {
                                _id: user._id,
                                fullName: user.fullName,
                            },
                        };
                    }),
                );
                return {
                    ...blog._doc,
                    author: {
                        _id: user._id,
                        fullName: user.fullName,
                    },
                    comments: dataComment,
                };
            }),
        );
        new OK({ message: 'Lấy danh sách bài viết thành công', metadata: data }).send(res);
    }

    async getBlogUser(req, res) {
        const { id } = req.user;
        const blogs = await modelBlog.find({ author: id });
        new OK({ message: 'Lấy danh sách bài viết thành công', metadata: blogs }).send(res);
    }
}

module.exports = new BlogController();
