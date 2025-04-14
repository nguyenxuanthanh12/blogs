import classNames from 'classnames/bind';
import styles from './RegisterUser.module.scss';
import Header from '../../Components/Header/Header';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { requestRegister } from '../../config/request';

import { ToastContainer, toast } from 'react-toastify';

const cx = classNames.bind(styles);

function RegisterUser() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validate = () => {
        const newErrors = {};

        // FullName validation
        if (!formData.fullName) {
            newErrors.fullName = 'Tên người dùng không được để trống';
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Tên người dùng phải có ít nhất 3 ký tự';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
               await requestRegister(formData);
                toast.success("Đăng ký thành công");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header>
                <Header />
            </header>
            <main>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom>
                            Đăng ký
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Tên người dùng"
                                name="fullName"
                                autoComplete="fullName"
                                autoFocus
                                value={formData.fullName}
                                onChange={handleChange}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Đăng ký
                            </Button>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Đã có tài khoản?
                                    <Button color="primary" sx={{ p: 0, minWidth: 'auto' }}>
                                        <Link to="/login">Đăng nhập</Link>
                                    </Button>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </main>
        </div>
    );
}

export default RegisterUser;
