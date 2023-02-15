import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-edux';

const Cart = () => {
    const { cart } = useSelector(state => state.cart);
    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto' }} className='store-card'>
            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Product name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{Math.floor()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Cart;