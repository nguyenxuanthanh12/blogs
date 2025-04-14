const usersRoutes = require('./users.routes');
const blogRoutes = require('./blog.routes');
const topicRoutes = require('./topic.routes');
const commentRoutes = require('./comment.routes');

function routes(app) {
    app.post('/api/register', usersRoutes);
    app.post('/api/login', usersRoutes);
    app.get('/api/auth', usersRoutes);
    app.get('/api/refresh-token', usersRoutes);
    app.post('/api/update-user', usersRoutes);
    app.get('/api/logout', usersRoutes);
    app.get('/api/get-all-user', usersRoutes);
    app.post('/api/update-user-admin', usersRoutes);
    app.delete('/api/delete-user-admin', usersRoutes);

    app.post('/api/create-blog', blogRoutes);
    app.get('/api/get-all-blog', blogRoutes);
    app.get('/api/get-blog-user', blogRoutes);

    app.post('/api/create-topic', topicRoutes);
    app.get('/api/get-all-topic', topicRoutes);

    app.post('/api/create-comment', commentRoutes);

    app.get('/admin', usersRoutes);
}

module.exports = routes;
