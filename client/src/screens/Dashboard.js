import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faHeart, faGear, faList, faStore, faFileInvoice, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../reducers/authSlice';
import { getCart } from '../reducers/cartSlice';
import { getInvoices } from '../reducers/orderSlice';
import Header from '../components/layout/Header';
import formatDate from '../utils/formatDate';
import StoreDetailItem from '../components/layout/StoreDetailItem';

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
    const { invoices } = useSelector((state) => state.order);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && user === null) {
            dispatch(loadUser());
            dispatch(getCart());
        }
    }, [dispatch, isAuthenticated, user]);

    useEffect(() => {
        dispatch(getInvoices());
    },[dispatch]);

    return (
        <Fragment>
            <div className='dashboard-container'>
                <Header text='Dashboard' />
                <div className='dashboard-nav'>
                    {links.map(link => (
                        <div key={link.id} style={{ width: '150px', height:'150px', marginTop: '10px' }}>
                            <FontAwesomeIcon style={{ background: 'none', marginBottom: '10px', color: `${link.color}` }} icon={link.icon} size='4x' /><br />
                            <Link to={`/${link.path}`} style={{ fontSize: '18px' }} className='remove-link-style'>{link.name}</Link>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ overflowX: 'scroll', overflowY: 'auto' }} className='invoice'>
                <Header text='Invoice history' />
                <table style={{ marginTop: '5px' }}>
                    <thead>
                        <tr>
                            <th>Serial#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Invoice ID</th>
                            <th>Number of items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr key={invoice._id}>
                                <td>{index + 1}</td>
                                <td>{formatDate(invoice.date)}</td>
                                <td>{new Date(invoice.date).toLocaleTimeString()}</td>
                                <td style={{ color: '#1483b8' }}><Link to={`/invoice/${invoice._id}`} className='remove-link-style'>{invoice._id}</Link></td>
                                <td>{invoice.goodspurchased.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default Dashboard;