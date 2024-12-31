import { useState } from 'react';
import styles from './SearchBar.module.scss';

const SearchBar = ({defaultValue, onSearchChange, handleSubmit}) => {
    const [keyword, setKeyword] = useState(defaultValue || '');
    const handleOnChange = (value) => {
        setKeyword(value);
        onSearchChange({keyword: value});
    }

    return (
        <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} className={styles.container}>
            <input className={styles.input} id="" type="text" placeholder='Nhập tên phim' value={keyword} onChange={(e) => handleOnChange(e.target.value)} />
            <button className={styles.button} type="submit">Search</button>
        </form>
    );
}

export default SearchBar;
