import { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import HomePage from './Components/HomePage/HomePage';

function App() {
    useEffect(() => {
        document.title = 'Trang Chủ';
    }, []);

    const [fetchDataBlog, setFetchDataBlog] = useState(false);

    return (
        <div className="wrapper">
            <header>
                <Header setFetchDataBlog={setFetchDataBlog} />
            </header>

            <main className="main">
                <HomePage fetchDataBlog={fetchDataBlog} />
            </main>
        </div>
    );
}

export default App;
