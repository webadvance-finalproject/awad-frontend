import { useState } from 'react';
import styles from './SearchBar.module.scss';

function SearchBar({initialValue}) {
    const [keyword, setKeyWord] = useState(initialValue || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        window.location.href = `/search?keyword=${keyword}`    
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <input className={styles.input} type="text" placeholder='Nhập tên phim' value={keyword} onChange={(e) => setKeyWord(e.target.value)} />
            <button className={styles.button} type="submit">Search</button>
        </form>
    );
}

export default SearchBar;
