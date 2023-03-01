import { useEffect, useState, Fragment } from 'react';
import Header from '../components/layout/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice, updateInvoice, clearOrderMessages } from '../reducers/orderSlice';
import FormAlert from '../components/layout/FormAlert';

const Invoice = () => {
    const [ goods, setGoods ] = useState([]);
    const [ invoiceMessage, setInvoiceMessage ] = useState({});
    const { invoice, message } = useSelector(state => state.order);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getInvoice(id));
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

    const updateStatus = (e, id, item_id, status) => {
        e.preventDefault();
        const data = {
            id: id,
            item_id: item_id,
            data: status
        };
        // console.log(data);
        dispatch(updateInvoice(data));
    }

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
                        <th>Confirm/Reject</th>
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
                            <td>
                                {item.status === 'processing' ? (
                                    <Fragment>
                                        <button onClick={(e) => updateStatus(e, invoice._id, item._id, 'received')} style={{ backgroundColor: 'rgba(3, 201, 53, 0.8)', padding: '5px', borderRadius: '5px', border: '0px', marginRight: '10px' }}>
                                            <FontAwesomeIcon style={iconStyle} className='clickable-icon-style' icon={faCheck} />
                                        </button>
                                        <button onClick={(e) => updateStatus(e, invoice._id, item._id, 'cancelled')} style={{ backgroundColor: '#F55050', padding: '5px', borderRadius: '5px', border: '0px'  }}>
                                            <FontAwesomeIcon style={iconStyle} className='clickable-icon-style' icon={faCancel} />
                                        </button>
                                    </Fragment>
                                ) : (
                                <Fragment>
                                    <button disabled style={{ backgroundColor: '#e3e6e7', padding: '5px', borderRadius: '5px', border: '0px', marginRight: '10px' }}>
                                        <FontAwesomeIcon style={iconStyle} className='clickable-icon-style' icon={faCheck} />
                                    </button>
                                    <button disabled style={{ backgroundColor: '#e3e6e7', padding: '5px', borderRadius: '5px', border: '0px'  }}>
                                        <FontAwesomeIcon style={iconStyle} className='clickable-icon-style' icon={faCancel} />
                                    </button>
                                </Fragment>
                                )}
                            </td>
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
                        <td></td>
                        <td>Total</td>
                        <td><b>{total(invoice.goodspurchased)}</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const iconStyle = {
    color: '#ffffff'
}

export default Invoice;