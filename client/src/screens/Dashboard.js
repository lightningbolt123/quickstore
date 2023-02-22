import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faHeart, faGear, faList, faStore, faFileInvoice, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../reducers/authSlice';
import { getCart } from '../reducers/cartSlice';

const links = [
    {
        id: '1',
        name: 'Settings',
        path: 'settings',
        color: '#2596be',
        icon: faGear
    },
    {
        id: '2',
        name: 'Customer purchase history',
        path: 'customer-purchase-history',
        color: '#2596be',
        icon: faList
    },
    {
        id: '3',
        name: 'Store',
        path: 'store',
        color: '#2596be',
        icon: faStore
    },
    {
        id: '4',
        name: 'Bank accounts',
        path: 'bank-accounts',
        color: '#2596be',
        icon: faBuildingColumns
    },
    {
        id: '5',
        name: 'Wishlist',
        path: 'wishlist',
        color: '#2596be',
        icon: faHeart
    }
]

const Dashboard = () => {
    const { isAuthenticated, user, message } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && user === null) {
            dispatch(loadUser());
            dispatch(getCart());
        }
    }, [dispatch, isAuthenticated, user]);

    return (
        <Fragment>
            <div className='dashboard-container'>
                <h1>Dashboard</h1>
                <div className='dashboard-nav'>
                    {links.map(link => (
                        <div key={link.id} style={{ width: '150px', height:'150px', marginTop: '10px' }}>
                            <FontAwesomeIcon style={{ background: 'none', marginBottom: '10px', color: `${link.color}` }} icon={link.icon} size='4x' /><br />
                            <Link to={`/${link.path}`} style={{ fontSize: '18px' }} className='remove-link-style'>{link.name}</Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className='dashboard-container'>
                <h1>Hello</h1>
            </div>
        </Fragment>
    );
};

export default Dashboard;