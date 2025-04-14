import axios from 'axios';
import cookies from 'js-cookie';

const request = axios.create({
    baseURL: import.meta.env.VITE_URL,
    withCredentials: true,
});

export const requestRegister = async (data) => {
    const response = await request.post('/api/register', data);
    return response.data;
};

export const requestAddUser = async (data) => {
    const response = await request.post('/api/add-user', data);
    return response.data;
};

export const requestLogin = async (data) => {
    const response = await request.post('/api/login', data);
    return response.data;
};

export const requestAuth = async () => {
    const response = await request.get('/api/auth');
    return response.data;
};

export const requestRefreshToken = async () => {
    const res = await request.get('/api/refresh-token');
    return res.data;
};

export const requestLogout = async () => {
    const response = await request.get('/api/logout');
    return response.data;
};

export const requestGetAllUser = async () => {
    const response = await request.get('/api/get-all-user');
    return response.data;
};

export const requestUpdateUserAdmin = async (data) => {
    const response = await request.post('/api/update-user-admin', data);
    return response.data;
};

export const requestUpdateUser = async (data) => {
    const response = await request.post('/api/update-user', data);
    return response.data;
};

export const requestDeleteUserAdmin = async (data) => {
    const response = await request.delete(`/api/delete-user-admin`, { params: data });
    return response.data;
};

export const requestGetAdmin = async () => {
    const response = await request.get('/admin');
    return response.data;
};

export const requestCreateBlog = async (data) => {
    const response = await request.post('/api/create-blog', data);
    return response.data;
};

export const requestGetAllBlog = async (idTopic) => {
    const response = await request.get(`/api/get-all-blog?idTopic=${idTopic}`);
    return response.data;
};

export const requestGetBlogUser = async () => {
    const response = await request.get('/api/get-blog-user');
    return response.data;
};

export const requestDeleteBlog = async (blogId) => {
    const response = await request.delete(`/api/delete-blog/${blogId}`);
    return response.data;
};

export const requestUpdateBlog = async (blogId, data) => {
    const response = await request.put(`/api/update-blog/${blogId}`, data);
    return response.data;
};

export const requestCreateTopic = async (data) => {
    const response = await request.post('/api/create-topic', data);
    return response.data;
};

export const requestGetAllTopic = async () => {
    const response = await request.get('/api/get-all-topic');
    return response.data;
};

export const requestCreateComment = async (data) => {
    const response = await request.post('/api/create-comment', data);
    return response.data;
};

let isRefreshing = false;
let failedRequestsQueue = [];

request.interceptors.response.use(
    (response) => response, // Trả về nếu không có lỗi
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) và request chưa từng thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Gửi yêu cầu refresh token
                    const token = cookies.get('logged');
                    if (!token) {
                        return;
                    }
                    await requestRefreshToken();

                    // Xử lý lại tất cả các request bị lỗi 401 trước đó
                    failedRequestsQueue.forEach((req) => req.resolve());
                    failedRequestsQueue = [];
                } catch (refreshError) {
                    // Nếu refresh thất bại, đăng xuất
                    failedRequestsQueue.forEach((req) => req.reject(refreshError));
                    failedRequestsQueue = [];
                    localStorage.clear();
                    window.location.href = '/login'; // Chuyển về trang đăng nhập
                } finally {
                    isRefreshing = false;
                }
            }

            // Trả về một Promise để retry request sau khi token mới được cập nhật
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    resolve: () => {
                        resolve(request(originalRequest));
                    },
                    reject: (err) => reject(err),
                });
            });
        }

        return Promise.reject(error);
    },
);
