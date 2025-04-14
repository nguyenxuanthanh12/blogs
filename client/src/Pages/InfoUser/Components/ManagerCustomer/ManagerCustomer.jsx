import styles from './ManagerCustomer.module.scss';
import classNames from 'classnames/bind';
import { Avatar, Button, Divider, TextField, Typography, Box, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../hooks/useStore';
import { requestUpdateUser } from '../../../../config/request';

import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

function ManagerCustomer() {
    const { dataUser } = useStore();

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: dataUser.fullName || '',
        email: dataUser.email || '',
    });

    useEffect(() => {
        setUserData({
            fullName: dataUser.fullName || '',
            email: dataUser.email || '',
        });
    }, [dataUser]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const data = {
                fullName: userData.fullName,
                email: userData.email,
            };
            const res = await requestUpdateUser(data);
            toast.success(res.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={cx('manager-customer')}>
            <ToastContainer />
            <Typography variant="h5" gutterBottom fontWeight="500">
                Thông tin tài khoản
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box className={cx('avatar-section')}>
                <Avatar sx={{ width: 120, height: 120, mb: 2 }} alt={userData.fullName} src="/path-to-avatar.jpg" />
                <Typography variant="subtitle1" fontWeight="500">
                    {userData.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {userData.email}
                </Typography>
            </Box>

            <Box className={cx('info-form')}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    {isEditing ? (
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                            Lưu thông tin
                        </Button>
                    ) : (
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>
                            Chỉnh sửa
                        </Button>
                    )}
                </Box>

                <Stack spacing={2} width="100%">
                    <TextField
                        fullWidth
                        label="Họ và tên"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant="outlined"
                    />
                </Stack>
            </Box>
        </div>
    );
}

export default ManagerCustomer;
