import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SmallButton from '../layout/SmallButton';
import Header from '../layout/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getVendorProducts, deleteProductFromStore, clearProductMessages } from '../../reducers/productSlice';

const UploadedProducts = ({ storeId }) => {
    const { products, msg } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVendorProducts(storeId));
    },[]);

    const removeProduct = (e, id) => {
        e.preventDefault();
        dispatch(deleteProductFromStore(id));
    }

    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto' }} className='store-card'>
            <Header text='My products' />
            <Link className='remove-link-style' to='/add-product'>
                <SmallButton text='ADD PRODUCT' icon={faPlus} float='right' onClickHandler={() => {}} />
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>Product image</th>
                        <th>Product name</th>
                        <th>Product price</th>
                        <th>Product discount</th>
                        <th>Product quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <img src={product.product_images[0].secure_url} style={{ width: '50px', height: '50px'}} />
                            </td>
                            <td>{product.product_name}</td>
                            <td>{product.product_price}</td>
                            <td>{product.product_discount}</td>
                            <td>{product.product_quantity}</td>
                            <td>
                                <FontAwesomeIcon onClick={(e) => removeProduct(e, product.id)} style={{ color: '#F55050', marginRight: '10px' }} className='clickable-icon-style' icon={faTrashAlt} />
                                <Link className='remove-link-style' to={`/update-product/${product.id}`}>
                                    <FontAwesomeIcon style={{ color: 'rgba(16, 121, 240, 0.8)', marginRight: '10px' }} className='clickable-icon-style' icon={faEdit} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UploadedProducts;