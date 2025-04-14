import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { Button, Modal, TextField, Typography } from '@mui/material';

import { useStore } from '../../hooks/useStore';
import { requestLogout, requestCreateBlog, requestCreateTopic } from '../../config/request';
import { toast } from 'react-toastify';
import { ManageAccounts } from '@mui/icons-material';

const cx = classNames.bind(styles);

function Header({ setFetchDataBlog }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = useState(false);
    const [blogData, setBlogData] = useState({
        content: '',
        topic: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { dataUser } = useStore();

    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const navigate = useNavigate();

    const handleClose = (path) => {
        setAnchorEl(null);
        if (path) {
            navigate(path);
            t;
        }
    };

    const handleLogout = async () => {
        try {
            await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => {
        setOpen(false);
        setImagePreview(null);
        setBlogData({
            title: '',
            content: '',
            topic: '',
            image: null,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData({
            ...blogData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setBlogData({
                ...blogData,
                image: selectedImage,
            });

            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataTopic = await requestCreateTopic({
                name: blogData.topic,
            });

            const formData = new FormData();
            formData.append('content', blogData.content);
            formData.append('topic', dataTopic.metadata._id);
            formData.append('image', blogData.image);

            await requestCreateBlog(formData);
            toast.success('Tạo bài viết thành công');
            handleCloseModal();
            setFetchDataBlog(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to="/">
                    <div className={cx('logo')}>
                        <h1>L2 Blog</h1>
                    </div>
                </Link>
                {dataUser._id ? (
                    <div className={cx('user-actions')}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenModal}
                            className={cx('create-post-btn')}
                        >
                            Tạo bài viết
                        </Button>

                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                <Tooltip title="Cài đặt tài khoản">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={openMenu ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openMenu ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>{dataUser.fullName.charAt(0)}</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={openMenu}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                {dataUser.isAdmin && (
                                    <MenuItem onClick={() => handleClose('manager-user')}>
                                        <ListItemIcon>
                                            <ManageAccounts fontSize="small" />
                                        </ListItemIcon>
                                        Quản lý sinh viên
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => handleClose('info-user')}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Cài đặt tài khoản
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </React.Fragment>
                    </div>
                ) : (
                    <div>
                        <Link to="/register">
                            <Button variant="contained" color="primary">
                                Đăng ký
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button sx={{ marginLeft: '10px' }} variant="contained" color="primary">
                                Đăng nhập
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Blog Creation Modal */}
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="blog-creation-modal"
                aria-describedby="modal-to-create-new-blog-post"
            >
                <Box className={cx('modal-container')}>
                    <Typography variant="h6" component="h2" className={cx('modal-title')}>
                        Tạo bài viết mới
                    </Typography>
                    <form onSubmit={handleSubmit} className={cx('blog-form')}>
                        <TextField
                            fullWidth
                            label="Chủ đề"
                            name="topic"
                            value={blogData.topic}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Nội dung"
                            name="content"
                            value={blogData.content}
                            onChange={handleChange}
                            margin="normal"
                            required
                            multiline
                            rows={6}
                            variant="outlined"
                        />

                        <div className={cx('file-input-container')}>
                            <Typography variant="subtitle1" className={cx('image-label')}>
                                Hình ảnh
                            </Typography>

                            <div className={cx('image-upload-area')}>
                                <input
                                    ref={fileInputRef}
                                    accept="image/*"
                                    id="blog-image"
                                    type="file"
                                    onChange={handleImageChange}
                                    required
                                    style={{ display: 'none' }}
                                />

                                {imagePreview ? (
                                    <div className={cx('preview-container')}>
                                        <img src={imagePreview} alt="Preview" className={cx('image-preview')} />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleBrowseClick}
                                            className={cx('change-image-btn')}
                                        >
                                            Đổi ảnh
                                        </Button>
                                    </div>
                                ) : (
                                    <div className={cx('upload-placeholder')} onClick={handleBrowseClick}>
                                        <ImageIcon sx={{ fontSize: 48, color: '#ccc' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Nhấp để tải lên hình ảnh
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cx('action-buttons')}>
                            <Button variant="contained" color="primary" type="submit">
                                Đăng bài
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleCloseModal}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default Header;
