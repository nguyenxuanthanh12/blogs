import { useEffect, useState } from 'react';
import styles from './ManagerBlog.module.scss';
import classNames from 'classnames/bind';
import { requestGetBlogUser, requestDeleteBlog, requestUpdateBlog } from '../../../../config/request';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Stack,
    IconButton,
    Pagination,
    Chip,
    Alert,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function ManagerBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editFormData, setEditFormData] = useState({
        content: '',
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await requestGetBlogUser();
                setBlogs(res.metadata);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setSnackbar({
                    open: true,
                    message: 'Không thể tải danh sách bài viết',
                    severity: 'error',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleOpenDeleteDialog = (blog) => {
        setSelectedBlog(blog);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteBlog = async () => {
        try {
            await requestDeleteBlog(selectedBlog._id);
            setBlogs(blogs.filter((blog) => blog._id !== selectedBlog._id));
            setSnackbar({
                open: true,
                message: 'Xóa bài viết thành công',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error deleting blog:', error);
            setSnackbar({
                open: true,
                message: 'Không thể xóa bài viết',
                severity: 'error',
            });
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    const handleOpenEditDialog = (blog) => {
        setSelectedBlog(blog);
        setEditFormData({
            content: blog.content,
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateBlog = async () => {
        try {
            const response = await requestUpdateBlog(selectedBlog._id, editFormData);

            // Update the blogs array with the updated blog
            setBlogs(blogs.map((blog) => (blog._id === selectedBlog._id ? { ...blog, ...editFormData } : blog)));

            setSnackbar({
                open: true,
                message: 'Cập nhật bài viết thành công',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            setSnackbar({
                open: true,
                message: 'Không thể cập nhật bài viết',
                severity: 'error',
            });
        } finally {
            setOpenEditDialog(false);
        }
    };

    const handleOpenViewDialog = (blog) => {
        setSelectedBlog(blog);
        setOpenViewDialog(true);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Get current blogs for pagination
    const indexOfLastBlog = page * rowsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - rowsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Truncate text for table display
    const truncateText = (text, maxLength = 60) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className={cx('manager-blog')}>
            <Box mb={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý bài viết
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Tổng số bài viết: {blogs.length}
                </Typography>
            </Box>

            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Nội dung</TableCell>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : currentBlogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có bài viết nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentBlogs.map((blog, index) => (
                                    <TableRow key={blog._id}>
                                        <TableCell>{indexOfFirstBlog + index + 1}</TableCell>
                                        <TableCell>{truncateText(blog.content)}</TableCell>
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={blog.image}
                                                alt="Blog Image"
                                                sx={{
                                                    width: 100,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{dayjs(blog.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {blogs.length > rowsPerPage && (
                    <Box display="flex" justifyContent="center" p={2}>
                        <Pagination
                            count={Math.ceil(blogs.length / rowsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Paper>
        </div>
    );
}

export default ManagerBlog;
