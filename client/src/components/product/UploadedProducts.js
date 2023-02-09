import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SmallButton from '../layout/SmallButton';
import Header from '../layout/Header';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const UploadedProducts = () => {
    return (
        <div style={{ overflowX: 'auto' }} className='store-card'>
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
                    </tr>
                </thead>
            </table>
        </div>
    )
}

export default UploadedProducts;