import classNames from 'classnames/bind';
import styles from './HomePage.module.scss';
import CardPost from './CardPost/CardPost';
import { requestGetAllBlog, requestGetAllTopic } from '../../config/request';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function HomePage({ fetchDataBlog }) {
    const [dataTopic, setDataTopic] = useState([]);
    const [dataBlog, setDataBlog] = useState([]);

    const [idTopicSelected, setIdTopicSelected] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await requestGetAllTopic();
            setDataTopic(data.metadata);
            setIdTopicSelected(data.metadata[0]?._id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await requestGetAllBlog(idTopicSelected);
            setDataBlog(data.metadata);
        };
        fetchData();
    }, [idTopicSelected, fetchDataBlog]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slide-bar')}>
                <h3>Chủ đề mới nhất</h3>
                <ul>
                    {dataTopic.map((item) => (
                        <li onClick={() => setIdTopicSelected(item._id)} key={item._id}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={cx('content')}>
                <div className={cx('posts-container')}>
                    {dataBlog.map((item) => (
                        <CardPost key={item._id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
