import { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import styles from './ManagerUser.module.scss';
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify';

import {
    Container,
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
    Typography,
    IconButton,
    Box,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import {
    requestAddUser,
    requestDeleteUserAdmin,
    requestGetAdmin,
    requestGetAllUser,
    requestUpdateUserAdmin,
} from '../../config/request';

import dayjs from 'dayjs';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ManagerUser() {
    const [users, setUsers] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        fullName: '',
        email: '',
        password: '',
        isAdmin: false,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                await requestGetAdmin();
                return;
            } catch (error) {
                navigate('/');
            }
        };
        fetchAdmin();
    }, []);

    const fetchData = async () => {
        const res = await requestGetAllUser();
        setUsers(res.metadata);
    };

    // Handle dialog open/close
    const handleAddDialogOpen = () => {
        setCurrentUser({ fullName: '', email: '', password: '', isAdmin: false });
        setOpenAddDialog(true);
    };

    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
    };

    const handleEditDialogOpen = (user) => {
        setCurrentUser(user);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const handleDeleteDialogOpen = (user) => {
        setCurrentUser(user);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: name === 'isAdmin' ? checked : value,
        });
    };

    // Handle CRUD operations
    const handleAddUser = async () => {
        const newUser = {
            ...currentUser,
            id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
            createdAt: new Date().toISOString().split('T')[0],
        };
        try {
            await requestAddUser(newUser)
            setUsers([...users, newUser]);
            await fetchData()
            handleAddDialogClose();
        } catch (error) {
            toast.error(error.response.data.message);
        }
       
    };

    const handleUpdateUser = async () => {
        const data = {
            ...currentUser,
            id: currentUser.id,
        };
        await requestUpdateUserAdmin(data);
        fetchData();
        handleEditDialogClose();
    };

    const handleDeleteUser = async () => {
        try {
            const data = {
                idUser: currentUser._id,
            };
            await requestDeleteUserAdmin(data);
            fetchData();
            handleDeleteDialogClose();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={cx('manager-user')}>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <main>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" fontWeight="bold">
                                Quản lý người dùng
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm..."
                                    InputProps={{
                                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                                    }}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={handleAddDialogOpen}
                                >
                                    Thêm mới
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã</TableCell>
                                        <TableCell>Họ tên</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Quyền</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                        <TableCell align="right">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user._id}</TableCell>
                                            <TableCell>{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.isAdmin ? 'Admin' : 'Thành viên'}</TableCell>
                                            <TableCell>{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleEditDialogOpen(user)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteDialogOpen(user)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>

                {/* Add User Dialog */}
                <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Thêm người dùng mới</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                name="fullName"
                                label="Họ tên"
                                fullWidth
                                value={currentUser.fullName}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="email"
                                label="Email"
                                fullWidth
                                type="email"
                                value={currentUser.email}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="password"
                                label="Mật khẩu"
                                fullWidth
                                type="password"
                                value={currentUser.password}
                                onChange={handleInputChange}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isAdmin"
                                        checked={currentUser.isAdmin}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Quyền Admin"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddDialogClose}>Hủy</Button>
                        <Button onClick={handleAddUser} variant="contained">
                            Thêm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                name="fullName"
                                label="Họ tên"
                                fullWidth
                                value={currentUser.fullName}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="email"
                                label="Email"
                                fullWidth
                                type="email"
                                value={currentUser.email}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="password"
                                label="Mật khẩu"
                                fullWidth
                                type="password"
                                value={currentUser.password}
                                onChange={handleInputChange}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isAdmin"
                                        checked={currentUser.isAdmin}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Quyền Admin"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Hủy</Button>
                        <Button onClick={handleUpdateUser} variant="contained">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete User Dialog */}
                <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa người dùng "{currentUser.fullName}" không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Hủy</Button>
                        <Button onClick={handleDeleteUser} color="error" variant="contained">
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
}

export default ManagerUser;
