import { useState } from 'react';
import Header from '../../Components/Header/Header';
import ManagerCustomer from './Components/ManagerCustomer/ManagerCustomer';
import styles from './InfoUser.module.scss';
import classNames from 'classnames/bind';
import { Paper, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import ManagerBlog from './Components/ManagerBlog/ManagerBlog';

const cx = classNames.bind(styles);

function InfoUser() {
    const [activeTab, setActiveTab] = useState('account');

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <ManagerCustomer />;
            case 'posts':
                return <ManagerBlog />;
            default:
                return <ManagerCustomer />;
        }
    };

    return (
        <div className={cx('info-user')}>
            <header>
                <Header />
            </header>

            <main>
                <Paper className={cx('slide-bar')} elevation={0}>
                    <Typography variant="h6" sx={{ p: 2, fontWeight: 500 }}>
                        Tài khoản của tôi
                    </Typography>
                    <Divider />
                    <List>
                        <ListItem
                            button
                            className={activeTab === 'account' ? cx('active') : ''}
                            onClick={() => setActiveTab('account')}
                        >
                            <ListItemIcon>
                                <PersonIcon color={activeTab === 'account' ? 'primary' : 'inherit'} />
                            </ListItemIcon>
                            <ListItemText primary="Thông tin tài khoản" />
                        </ListItem>
                        <ListItem
                            button
                            className={activeTab === 'posts' ? cx('active') : ''}
                            onClick={() => setActiveTab('posts')}
                        >
                            <ListItemIcon>
                                <ArticleIcon color={activeTab === 'posts' ? 'primary' : 'inherit'} />
                            </ListItemIcon>
                            <ListItemText primary="Quản lý bài viết" />
                        </ListItem>
                    </List>
                </Paper>
                <Paper className={cx('content')} elevation={0}>
                    {renderContent()}
                </Paper>
            </main>
        </div>
    );
}

export default InfoUser;
