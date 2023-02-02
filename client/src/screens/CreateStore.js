import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../components/layout/InputField';
import { faShop, faGlobe, faHouse, faSign, faMapLocationDot, faCity, faEarthEurope } from '@fortawesome/free-solid-svg-icons';

const CreateStore = () => {
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
    const { loading, errors, error } = useSelector((state) => state.store);
    
    const {
        name,
        shop_url,
        house,
        street,
        postalcode,
        city,
        country,
    } = formData;

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

    return (
        <form className='dashboard-form'>
            <InputField type='text' label='Name' name='name' value={name} changeHandler={onChange} error={getError('name')} icon={faShop} />
            <InputField type='text' label='Website address' name='shop_url' value={shop_url} changeHandler={onChange} error={getError('shop_url')} icon={faGlobe} />
            <InputField type='text' label='House' name='house' value={house} changeHandler={onChange} error={getError('house')} icon={faHouse} />
            <InputField type='text' label='Street' name='street' value={street} changeHandler={onChange} error={getError('street')} icon={faSign} />
            <InputField type='text' label='Postalcode' name='postalcode' value={postalcode} changeHandler={onChange} error={getError('postalcode')} icon={faMapLocationDot} />
            <InputField type='text' label='City' name='City' value={city} changeHandler={onChange} error={getError('city')} icon={faCity} />
            <InputField type='text' label='Country' name='Country' value={country} changeHandler={onChange} error={getError('country')} icon={faEarthEurope} />
        </form>
    )
}

export default CreateStore;