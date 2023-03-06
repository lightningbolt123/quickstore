import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../layout/Button';
import { faCheck, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StoreDetailItem from '../layout/StoreDetailItem';
import Header from '../layout/Header';
import { clearMessages, uploadOrUpdateStoreIcon } from '../../reducers/storeSlice';
import FormAlert from '../layout/FormAlert';

const StoreCard = ({ store, message, loading }) => {
    const [ storeIcon, setStoreIcon ] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (JSON.stringify(message) !== '{}') {
            setTimeout(() => {
                dispatch(clearMessages());
            },3000);
        }
        if (store && store.icon) {
            setStoreIcon(store.icon.secure_url);
        }
    },[store, dispatch, message]);

    const onChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setStoreIcon(reader.result);
            const data = {
                icon: reader.result
            }
            dispatch(uploadOrUpdateStoreIcon(data));
        }
    }
    
    if (!store && message) {
        return (
            <div className='store-card'>
                <h1>Store details</h1>
                <span>{message.msg}</span>
                <Link className='remove-link-style' to='/create-store'>
                    <Button text='CREATE STORE' icon={faCheck} />
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
        <Header text='Store details' /><br />
        {JSON.stringify(message) !== '{}' ? <FormAlert alert={message} /> : ''}
        <div className='store-details-container'>
            <label htmlFor='store-icon' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {storeIcon ? <img src={storeIcon} className='image-thumbnail-placeholder' alt='placeholder' /> : <FontAwesomeIcon className='image-thumbnail-placeholder' size='10x' icon={faCamera} />}
            </label>
            <input type='file' id='store-icon' style={{ display: 'none' }} onChange={(e) => onChange(e)} /><br />
        </div>
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
        <Link className='remove-link-style' to='/update-store'>
            <Button text='UPDATE STORE' loading={loading} icon={faCheck} />
        </Link>
    </div>
    )
}

StoreCard.propTypes = {
    store: PropTypes.object,
    message: PropTypes.object,
    loading: PropTypes.bool
}

export default StoreCard;