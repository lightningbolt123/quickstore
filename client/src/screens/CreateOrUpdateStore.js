import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../components/layout/InputField';
import { faShop, faGlobe, faHouse, faSign, faMapLocationDot, faCity, faEarthEurope, faUpload } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/layout/Button';
import FormAlert from '../components/layout/FormAlert';
import { createOrUpdateStore, clearMessages } from '../reducers/storeSlice';

const CreateOrUpdateStore = () => {
    const [formData, setFormData ] = useState({
        name: '',
        shop_url: '',
        house: '',
        street: '',
        postalcode: '',
        city: '',
        country: ''
    });

    const dispatch = useDispatch();
    const { loading, store, msg, errors } = useSelector((state) => state.store);
    const navigate = useNavigate();
    
    const {
        name,
        shop_url,
        house,
        street,
        postalcode,
        city,
        country,
    } = formData;

    useEffect(() => {
        if (msg && msg.status_code === '201') {
            dispatch(clearMessages());
            navigate('/store');
        }
        if (store) {
            setFormData({
                name: store? store.name : '',
                shop_url: store? store.shop_url : '',
                house: store? store.house : '',
                street: store? store.street : '',
                postalcode: store? store.postalcode : '',
                city: store? store.city : '',
                country: store? store.country : ''
            });
        }
    },[msg, dispatch, store, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createOrUpdateStore(formData));
    }

    // const redirectOnSuccess = (msg) => {
    //     if (msg.status_code === '201') {
    //         setTimeout(() => {
    //             dispatch(clearMessages());
    //         }, 2000);

    //         setTimeout(() => {
    //             dispatch(clearMessages());
    //             navigate('/store');
    //         }, 3000);
    //     }
    // }

    // redirectOnSuccess(msg);

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <span className='header-text'>{store? 'Update your store': 'Create your store'}</span>
            {JSON.stringify(msg) !== '{}' ? (<FormAlert alert={msg} />) : ''}
            <InputField type='text' label='Store name' name='name' value={name} changeHandler={onChange} error={getError('name')} icon={faShop} />
            <InputField type='text' label='Website address' name='shop_url' value={shop_url} changeHandler={onChange} error={getError('shop_url')} icon={faGlobe} />
            <InputField type='text' label='House' name='house' value={house} changeHandler={onChange} error={getError('house')} icon={faHouse} />
            <InputField type='text' label='Street' name='street' value={street} changeHandler={onChange} error={getError('street')} icon={faSign} />
            <InputField type='text' label='Postalcode' name='postalcode' value={postalcode} changeHandler={onChange} error={getError('postalcode')} icon={faMapLocationDot} />
            <InputField type='text' label='City' name='city' value={city} changeHandler={onChange} error={getError('city')} icon={faCity} />
            <InputField type='text' label='Country' name='country' value={country} changeHandler={onChange} error={getError('country')} icon={faEarthEurope} />
            <Button text={store? 'UPDATE': 'CREATE'} loading={loading} icon={faUpload} />
        </form>
    )
}

export default CreateOrUpdateStore;