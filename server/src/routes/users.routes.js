const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const controllerUsers = require('../controllers/users.controller');

router.post('/api/register', asyncHandler(controllerUsers.register));
router.post('/api/login', asyncHandler(controllerUsers.login));
router.get('/api/auth', authUser, asyncHandler(controllerUsers.authUser));
router.get('/api/refresh-token', asyncHandler(controllerUsers.refreshToken));
router.post('/api/update-user', authUser, asyncHandler(controllerUsers.updateUser));
router.get('/api/logout', authUser, asyncHandler(controllerUsers.logout));

router.get('/api/get-all-user', authAdmin, asyncHandler(controllerUsers.getAllUser));

router.post('/api/update-user-admin', authAdmin, asyncHandler(controllerUsers.updateUserAdmin));
router.delete('/api/delete-user-admin', authAdmin, asyncHandler(controllerUsers.deleteUserAdmin));

router.get('/admin', authAdmin, (req, res) => {
    return res.status(200).json({ message: true });
});

module.exports = router;
