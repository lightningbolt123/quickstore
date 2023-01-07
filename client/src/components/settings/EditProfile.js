import { useState } from 'react';
import InputField from '../layout/InputField';
import PhoneInputField from '../layout/PhoneInputField';
import Button from '../layout/Button';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faHouse, faLocationArrow, faMap, faCity, faGlobe, faEdit, faLocationPin } from '@fortawesome/free-solid-svg-icons';

const EditProfile = ({ errors, loading }) => {
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

    const onChange = e => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }
    return (
        <form className='dashboard-form'>
            <h1>Edit your profile</h1>
            <InputField type='text' label='Firstname' name='firstname' value={firstname} error={getError('firstname')} changeHandler={onChange} icon={faUser} />
            <InputField type='text' label='Lastname' name='lastname' value={lastname} error={getError('lastname')} changeHandler={onChange} icon={faUser} />
            <InputField type='text' label='Email' name='email' value={email} changeHandler={onChange} error={getError('email')} icon={faEnvelope} />
            <PhoneInputField type='text' label='Phonenumber' name='phonenumber' changeHandler={onChange} error={getError('phonenumber')} value={phonenumber} />
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
    loading: PropTypes.bool
}

export default EditProfile;