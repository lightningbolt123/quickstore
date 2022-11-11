import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../reducers/productSlice';

const Product = () => {
    const dispatch = useDispatch();
    const { loading, products } = useSelector((state) => state.product);
    useEffect(() => {
        dispatch(getProducts());
    },[dispatch]);
    if (loading) return <p>Loading...</p>
    return (<div className='product-list'>
        {products.map(product => (
            <div key={product.id} className='product-card'>
                <img src={product.product_images[0].secure_url} className='product-card-image' />
                <p>{product.product_name.slice(0, 20)}...</p>
                <b>${product.product_price}</b>
                <button className='button-orange'>Add to cart<i className="fa-regular fa-cart-shopping"></i></button>
            </div>
        ))}
    </div>)
}

export default Product;