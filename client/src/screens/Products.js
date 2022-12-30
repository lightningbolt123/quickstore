import React, { Fragment, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../reducers/productSlice';
import Banner from '../components/Banner';
import ProductCard from '../components/product/ProductCard';

const Product = () => {
    const dispatch = useDispatch();
    const { loading, products } = useSelector((state) => state.product);
    useEffect(() => {
        dispatch(getProducts());
    },[dispatch]);
    if (loading) return <p>Loading...</p>
    return (
        <Fragment>
            <Banner />
            <div className='product-list'>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </Fragment>
    )
}

export default Product;