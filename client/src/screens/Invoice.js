import { useEffect, useState, Fragment } from 'react';
import Header from '../components/layout/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice,updateInvoice } from '../reducers/orderSlice';
import SmallButton from '../components/layout/SmallButton';

const Invoice = () => {
    const { invoice } = useSelector(state => state.order);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getInvoice(id));
    },[id, dispatch]);

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
                    {invoice.goodspurchased && invoice.goodspurchased.map((item, index) => (
                        <tr key={item.productid}>
                            <td>{index + 1}</td>
                            <td>{item.storeid}</td>
                            <td>{item.productname}</td>
                            <td>{item.status}</td>
                            <td>
                                {item.status === 'processing' ? (
                                    <Fragment>
                                        <button style={{ backgroundColor: 'rgba(3, 201, 53, 0.8)', padding: '5px', borderRadius: '5px', border: '0px', marginRight: '10px' }}>
                                            <FontAwesomeIcon style={iconStyle} className='clickable-icon-style' icon={faCheck} />
                                        </button>
                                        <button style={{ backgroundColor: '#F55050', padding: '5px', borderRadius: '5px', border: '0px'  }}>
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