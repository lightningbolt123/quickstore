import { useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist } from '../reducers/wishlistSlice';
import Header from '../components/layout/Header';
import FormAlert from '../components/layout/FormAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { removeFromWishlist, clearWishlistMessage } from '../reducers/wishlistSlice';

const Wishlist = () => {
    const { items, wishlistMessage } = useSelector(state => state.wishlist);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getWishlist());
    },[dispatch]);

    useEffect(() => {
        if (JSON.stringify(wishlistMessage) !== '{}') {
            setTimeout(() => {
                dispatch(clearWishlistMessage());
            },3000);
        }
    },[wishlistMessage, dispatch]);

    const removeFromWish = (e, id) => {
        dispatch(removeFromWishlist(id));
    }
    
    return (
        <Fragment>
            {wishlistMessage && JSON.stringify(wishlistMessage) !== '{}' ? (<FormAlert alert={wishlistMessage} />) : ''}
            <div className='cart' style={{ minHeight: '100px' }}>
                <Header text='Wishlist' />
                <table style={{ marginTop: '10px' }}>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.productid}>
                                <td>{index + 1}</td>
                                <td>
                                    <div style={{ width: '50px', height: '50px' }}>
                                        <img src={item.productimage} style={{ width: '100%', height: 'auto', borderRadius: '5px' }} alt='product placeholder' />
                                    </div>
                                </td>
                                <td>{item.productname}</td>
                                <td>${item.productprice}</td>
                                <td>
                                    <FontAwesomeIcon onClick={(e) => removeFromWish(e, item.productid)} className='clickable-icon-style' style={{ color: '#F55050' }} icon={faTrash} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default Wishlist;