import { useState, useEffect } from 'react';
import InputField from '../layout/InputField';
import PhoneInputField from '../layout/PhoneInputField';
import Button from '../layout/Button';
import PropTypes from 'prop-types';
import { faUser, faEnvelope, faHouse, faLocationArrow, faMap, faCity, faGlobe, faEdit, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { updateAccount, clearMessages } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';
import FormAlert from '../layout/FormAlert';
import Header from '../layout/Header';

const EditProfile = ({ errors, loading, user, message }) => {
    const [ formData, setFormData ] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        house: '',
        street: '',
        town: '',
        postalcode: '',
        city: '',
        country: ''
    });

    const dispatch = useDispatch();

    useEffect(() => {
        setFormData({
            firstname: user ? user.firstname : '',
            lastname: user ? user.lastname : '',
            email: user ? user.email : '',
            phonenumber: user ? user.phonenumber : '',
            house: user ? user.house : '',
            street: user ? user.street : '',
            town: user ? user.town : '',
            postalcode: user ? user.postalcode : '',
            city: user ? user.city : '',
            country: user ? user.country : ''
        });
    },[user]);

    const {
        firstname,
        lastname,
        email,
        phonenumber,
        house,
        street,
        town,
        postalcode,
        city,
        country
    } = formData;

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const onChangePhone = (value) => {
        setFormData({ ...formData, phonenumber: value});
    }

    const onChange = e => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const response = dispatch(updateAccount(formData));
        if (response) {
            setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
        }
    }
    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Edit your profile' />
            {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}

            <InputField type='text' label='Firstname' name='firstname' value={firstname} error={getError('firstname')} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Lastname' name='lastname' value={lastname} error={getError('lastname')} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Email' name='email' value={email} changeHandler={onChange} error={getError('email')} icon={faEnvelope} />

            <PhoneInputField type='text' label='Phonenumber' name='phonenumber' changeHandler={onChangePhone} error={getError('phonenumber')} value={phonenumber} />

            <InputField type='text' label='House' name='house' value={house} error={getError('house')} changeHandler={onChange} icon={faHouse} />

            <InputField type='text' label='Street' name='street' value={street} error={getError('street')} changeHandler={onChange} icon={faLocationArrow} />

            <InputField type='text' label='Town' name='town' value={town} error={getError('town')} changeHandler={onChange} icon={faMap} />

            <InputField type='text' label='Postalcode' name='postalcode' value={postalcode} error={getError('postalcode')} changeHandler={onChange} icon={faLocationPin} />

            <InputField type='text' label='City' name='city' value={city} error={getError('city')} changeHandler={onChange} icon={faCity} />

            <InputField type='text' label='Country' name='country' value={country} error={getError('country')} changeHandler={onChange} icon={faGlobe} />
            
            <Button text='UPDATE' icon={faEdit} loading={loading} />
        </form>
    )
}

EditProfile.propTypes = {
    errors: PropTypes.array,
    loading: PropTypes.bool,
    user: PropTypes.object,
    message: PropTypes.object
}

export default EditProfile;