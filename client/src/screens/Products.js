import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../reducers/productSlice';
import Banner from '../components/Banner';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/layout/Spinner';

const Product = () => {
    const dispatch = useDispatch();
    const { loading, products } = useSelector((state) => state.product);
    useEffect(() => {
        dispatch(getProducts());
    },[dispatch]);
    if (loading) return <Spinner />
    return (
        <Fragment>
            <Banner />
            <div className='product-list'>
                {products && products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </Fragment>
    )
}

export default Product;