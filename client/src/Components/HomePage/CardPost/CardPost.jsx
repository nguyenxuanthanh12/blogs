import classNames from 'classnames/bind';
import styles from './CardPost.module.scss';

import dayjs from 'dayjs';
import { useState } from 'react';
import { requestCreateComment } from '../../../config/request';



const cx = classNames.bind(styles);

function CardPost({ item }) {
    const [valueComment, setValueComment] = useState('');
    const [comments, setComments] = useState(item.comments || []);

    const handleComment = async () => {
        const data = {
            content: valueComment,
            blog: item._id,
        };
        const res = await requestCreateComment(data);

        setComments([...comments, res.metadata]);
        setValueComment('');
    };

    return (
        <div className={cx('card-post')}>
            <div className={cx('post')}>
                <div className={cx('post-header')}>
                    <div className={cx('post-user-info')}>
                        <img src="https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png" alt="" />
                        <div>
                            <h3>{item.author.fullName}</h3>
                            <p>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                        </div>
                    </div>
                </div>

                <div className={cx('post-content')}>
                    <p>{item.content}</p>
                </div>

                <div className={cx('post-image')}>
                    <img src={item.image} alt="" />
                </div>

                <div className={cx('list-comment')}>
                    {comments.map((comment, index) => (
                        <div key={index} className={cx('comment-item')}>
                            <img
                                src="https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png"
                                alt=""
                            />
                            <div>
                                <h3>{comment.author.fullName}</h3>
                                <p>{comment.content}</p>
                                <p style={{ fontSize: '12px' }}>
                                    {dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={cx('post-comments')}>
                    <div className={cx('comment-input')}>
                        <img
                            src="https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png"
                            alt=""
                        />
                        <input
                            onChange={(e) => setValueComment(e.target.value)}
                            type="text"
                            value={valueComment}
                            placeholder="Viết bình luận..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleComment();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardPost;
