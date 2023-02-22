import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart } from '../reducers/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import FormAlert from '../components/layout/FormAlert';

const Cart = () => {
    const { cart, msg } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCart());
    },[dispatch]);

    const removeItem = (e, id) => {
        e.preventDefault();
        dispatch(removeFromCart(id));
        // console.log(id);
    }

    return (
        <div className='cart' style={{ minHeight: '40vh' }}>
            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Product name</th>
                        <th>Price ($)</th>
                        <th>Quantity</th>
                        <th>Total ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.productid}>
                            <td>
                                <div style={{ width: '70px', height: '70px' }}>
                                    <img src={item.productimage} style={{ width: '100%', height: 'auto', borderRadius: '5px' }} alt='productimage' />
                                </div>
                            </td>
                            <td>{item.productname}</td>
                            <td>{item.productprice}</td>
                            <td>{item.quantity}</td>
                            <td>{item.total}<FontAwesomeIcon style={{ marginLeft: '10px', color: '#F55050' }} onClick={(e) => removeItem(e, item._id)} className='clickable-icon-style' icon={faTrashAlt} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cart;