import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInUserStore } from '../../reducers/storeSlice';
import Button from '../layout/Button';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import StoreDetailItem from '../layout/StoreDetailItem';

const StoreCard = () => {
    const dispatch = useDispatch();
    const { store, loading, error } = useSelector((state) => state.store);

    useEffect(() => {
        dispatch(fetchLoggedInUserStore());
    },[dispatch]);

    if (!store) {
        return (
            <div className='store-card'>
                <h1>Store details</h1>
                <span>You don't have a store, create one by clicking the button below.</span>
                <Link className='remove-link-style' to='/create-store'>
                    <Button text='CREATE STORE' loading={loading} icon={faCheck} />
                </Link>
            </div>
        );
    }
    const {
        name,
        shop_url,
        house,
        street,
        postalcode,
        city,
        country
    } = store;
    return (
    <div className='store-card'>
        <h1>Store details</h1>
        <div className='store-details-container'>
            <div className='store-card-details'>
                <StoreDetailItem label='Name' data={name} /><br />
                <StoreDetailItem label='Website' data={shop_url} /><br />
                <StoreDetailItem label='House No' data={house} /><br />
                <StoreDetailItem label='Street' data={street} /><br />
            </div>
            <div className='store-card-details'>
                <StoreDetailItem label='Postalcode' data={postalcode} /><br />
                <StoreDetailItem label='City' data={city} /><br />
                <StoreDetailItem label='Country' data={country} /><br />
            </div>
        </div>
    </div>
    )
}

export default StoreCard;