import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart, clearCart } from '../reducers/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck, faCreditCard, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { placeOrder, clearOrderMessages } from '../reducers/orderSlice';
import FormAlert from '../components/layout/FormAlert';
import Header from '../components/layout/Header';
import InputField from '../components/layout/InputField';
import Button from '../components/layout/Button';

const Cart = () => {
    const [ cardnumber, setCardnumber ] = useState('');
    const [ cvv, setCvv ] = useState('');
    const [ expirydate, setExpirydate ] = useState('');
    const { cart } = useSelector(state => state.cart);
    const { message, errors } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCart());
    },[dispatch]);

    useEffect(() => {
        if (errors.length > 0 || JSON.stringify(message) !== '{}') {
            setTimeout(() => {
                dispatch(clearOrderMessages());
                dispatch(clearCart());
            }, 20000);
        }

        if (message.status_code === '200' || message.status_code === '201') {
            setCardnumber('');
            setCvv('');
            setExpirydate('');
        }
    },[errors, message, dispatch]);

    const cardOnchange = (e) => {
        if (!isNaN(e.target.value)) {
            setCardnumber(e.target.value);
        }
    }

    const cvvOnchange = (e) => {
        if (!isNaN(e.target.value)) {
            setCvv(e.target.value);
        }
    }

    const expiryOnchange = (e) => {
        setExpirydate(e.target.value);
    }

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const removeItem = (e, id) => {
        e.preventDefault();
        dispatch(removeFromCart(id));
        // console.log(id);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const items = [];
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            const item = {
                productid: cart[i].productid,
                status:"processing",
                storeid: cart[i].storeid,
                productname: cart[i].productname,
                price: cart[i].productprice,
                quantity: cart[i].quantity,
                cost: cart[i].total
            }
            total += cart[i].total;
            items.push(item);
        }
        const orderData = {
            items,
            cardnumber,
            cvv,
            expirydate,
            total
        }
        dispatch(placeOrder(orderData));
    }

    return (
        <div className='cart' style={{ minHeight: '100px' }}>
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
            
            {cart.length > 0 && (
                <form onSubmit={(e) => onSubmit(e)} className='cart-form'>
                    {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}
                    <Header text='Place order' />
                    <InputField type='text' label='card number' name='cardnumber' value={cardnumber} changeHandler={cardOnchange} error={getError('cardnumber')} icon={faCreditCard} placeholder='xxxx-xxxx-xxxx-xxxx'/>
                    <InputField type='text' label='cvv' name='cvv' value={cvv} changeHandler={cvvOnchange} error={getError('cvv')} icon={faCreditCard} placeholder='xxx'/>
                    <InputField type='text' label='expiry date' name='expirydate' value={expirydate} changeHandler={expiryOnchange} error={getError('expirydate')} icon={faCalendar} placeholder='mm/yy'/>
                    <Button text='SUBMIT' icon={faCheck} />
                </form>
            )}
        </div>
    )
}

export default Cart;