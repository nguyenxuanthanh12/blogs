const modelTopic = require('../models/topic.model');

const { OK, Created } = require('../core/success.response');

class TopicController {
    async createTopic(req, res) {
        const { name } = req.body;
        const topic = await modelTopic.create({ name });
        new Created({ message: 'Tạo chủ đề thành công', metadata: topic }).send(res);
    }

    async getAllTopic(req, res) {
        const topics = await modelTopic.find();
        new OK({ message: 'Lấy danh sách chủ đề thành công', metadata: topics }).send(res);
    }
}
module.exports = new TopicController();
