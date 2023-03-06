import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../reducers/authSlice';
import { clearStore } from '../../reducers/storeSlice';

const Navigator = () => {
    const [ menuState, setMenuState ] = useState(false);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setMenuState(current => !current);
    }

    const logoutUser = () => {
        dispatch(logout());
        dispatch(clearStore());
        navigate('/login');
    }

    return (
    <div className='menu'>
        <h2 className='header-logo'><Link className='remove-link-style' to='/'>QuickStore</Link><FontAwesomeIcon className='navbar-icon' icon={faBars} onClick={toggleMenu} /></h2>
        <ul className={menuState? 'hamburger-menu': ''}>
            {isAuthenticated ? '': (<Fragment>
                <Link to='/login' className='remove-link-style'><li>Login</li></Link>
                <Link to='/signup' className='remove-link-style'><li>Signup</li></Link>
            </Fragment>)}
            {isAuthenticated ? (
                <Fragment>
                    <Link to='/dashboard' className='remove-link-style'><li>Dashboard</li></Link>
                    <Link to='/cart' className='remove-link-style'><li>Cart</li></Link>
                    <Link to='/wishlist' className='remove-link-style'><li>wishlist</li></Link>
                    <li style={{ cursor: 'pointer' }} onClick={logoutUser}>Logout</li>
                </Fragment>
            ) : ''}
        </ul>
    </div>)
}

export default Navigator;