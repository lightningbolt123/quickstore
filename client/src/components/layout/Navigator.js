import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navigator = () => {
    const [ menuState, setMenuState ] = useState(false);
    const toggleMenu = () => {
        setMenuState(current => !current);
    }
    return (
    <div className='menu'>
        <h2 className='header-logo'>QuickStore <FontAwesomeIcon className='navbar-icon' icon={faBars} onClick={toggleMenu} /></h2>
        <ul className={menuState? 'hamburger-menu': ''}>
            <li>home</li>
            <li>categories</li>
            <li>cart</li>
            <li>wishlist</li>
        </ul>
    </div>)
}

export default Navigator;