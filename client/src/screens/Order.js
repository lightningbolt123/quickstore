import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, clearOrderMessages } from '../reducers/orderSlice';
import FormAlert from '../components/layout/FormAlert';

const Order = () => {
    const [ goods, setGoods ] = useState([]);
    const [ invoiceMessage, setInvoiceMessage ] = useState({});
    const { invoice, message } = useSelector(state => state.order);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getOrder(id));
    },[id, dispatch]);

    useEffect(() => {
        if (invoice && invoice.goodspurchased && goods.length === 0) {
            setGoods(invoice.goodspurchased);
        }
        if (JSON.stringify(message) !== '{}' && message.order_status !== 'processing') {
            setGoods(goods.map(item => item._id === message.item_id ? { ...item, status: message.order_status } : item));
            dispatch(clearOrderMessages());
        }
    },[dispatch, invoice, message, goods]);

    useEffect(() => {
        if (JSON.stringify(message) !== '{}' && message.msg && message.order_status !== 'processing') {
            setInvoiceMessage(message);
            setTimeout(() => {
                setInvoiceMessage({});
            },3000);
        }
    },[message]);

    const total = (goods) => {
        let cost = 0;
        if (goods && goods.length > 0) {
            for (let i = 0; i < goods.length; i++) {
                cost += goods[i].cost;
            }
            return cost;
        }
    }
    
    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto', marginTop: '10px' }} className='invoice'>
            <Header text='Receipt' />
            {JSON.stringify(invoiceMessage) !== '{}' ? (<FormAlert alert={invoiceMessage} />) : ''}
            <table style={{ marginTop: '5px' }}>
                <thead>
                    <tr>
                        <th>Serial #</th>
                        <th>Store ID</th>
                        <th>Product name</th>
                        <th>Status</th>
                        <th>Price ($)</th>
                        <th>Quantity</th>
                        <th>Cost ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {goods && goods.map((item, index) => (
                        <tr key={item.productid}>
                            <td>{index + 1}</td>
                            <td>{item.storeid}</td>
                            <td>{item.productname}</td>
                            <td>{item.status}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.cost}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td><b>{total(invoice.goodspurchased)}</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Order;