import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../reducers/orderSlice';
import formatDate from '../utils/formatDate';
import Header from '../components/layout/Header';

const Orders = () => {
    const { orders, message } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrders());
    },[dispatch]);
    
    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto' }} className='order'>
            <Header text='Orders' />
            <table>
                <thead>
                    <tr>
                        <th>Serial#</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Invoice ID</th>
                        <th>Customer name</th>
                        <th>Phone</th>
                        <th>Number of items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{formatDate(order.date)}</td>
                            <td>{new Date(order.date).toLocaleTimeString()}</td>
                            <td style={{ color: '#1483b8' }}><Link to={`/invoice/${order._id}`} className='remove-link-style'>{order._id}</Link></td>
                            <td>{order.customerfirstname}{' '}{order.customerlastname}</td>
                            <td>{order.customerphone}</td>
                            <td>{order.goodspurchased.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Orders;