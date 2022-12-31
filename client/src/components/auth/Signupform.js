import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import InputField from '../layout/InputField';
import { faUser, faEnvelope, faLock, faHouse, faLocationArrow, faMap, faCity, faGlobe, faAddressCard, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import PhoneInputField from '../layout/PhoneInputField';
import PasswordInputField from '../layout/PasswordInputField';
import { signupUser } from '../../reducers/authSlice';
import Button from '../layout/Button';

const Signupform = ({ errors, loading }) => {
    const [ formData, setFormData ] = useState({
        firstname:'',
        lastname:'',
        email:'',
        phonenumber:'',
        password:'',
        password2:'',
        house:'',
        street:'',
        town:'',
        postalcode:'',
        city:'',
        country:''
    });

    const [ passwordError, setPasswordError ] = useState(false);

    const [ formError, setFormError ] = useState({
        message:'',
        status:'',
        statusCode:''
    });

    const dispatch = useDispatch();

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        } else {
            if (typeof errors[0] !== 'undefined') {
               setTimeout(() => {
                setFormError({...formError, message: errors[0].msg, status: errors[0].status, statusCode: errors[0].status_code });
               }, 3000);
            }
        }
    }

    const {
        firstname,
        lastname,
        email,
        phonenumber,
        password,
        password2,
        house,
        street,
        town,
        postalcode,
        city,
        country
    } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onChangePhone = (value) => {
        setFormData({ ...formData, phonenumber: value});
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (password === password2) {
            const data = {
                firstname,
                lastname,
                email,
                phonenumber,
                password,
                house,
                street,
                town,
                postalcode,
                city,
                country
            };
            dispatch(signupUser(data));
        } else {
            setPasswordError(current => !current);
            setTimeout(() => {
                setPasswordError(current => !current);
            },3000)
        }
    }

    return (
        <form onSubmit={(e) => onSubmitHandler(e)}>
            <span style={{ color: '#555', fontSize: '24px' }}>Signup</span>

            {formError && formError ? '' : (
                <div className='form-error'>
                    <span>{formError.msg}</span><br />
                </div>
            )}
            
            
            <InputField type='text' label='Firstname' name='firstname' value={firstname} error={getError('firstname')} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Lastname' name='lastname' value={lastname} error={getError('lastname')} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Email' name='email' value={email} error={getError('email')} changeHandler={onChange} icon={faEnvelope} />

            <PhoneInputField label='Phone number' name='phonenumber' value={phonenumber} error={getError('phonenumber')} changeHandler={onChangePhone} />

            <PasswordInputField type='password' label='Password' name='password' passwordError={passwordError} value={password} error={getError('password')} icon={faLock} changeHandler={onChange} />

            <PasswordInputField type='password' label='Repeat password' name='password2' passwordError={passwordError} value={password2} icon={faLock} changeHandler={onChange} />

            <InputField type='text' label='House' name='house' value={house} error={getError('house')} icon={faHouse} changeHandler={onChange} />

            <InputField type='text' label='Street' name='street' value={street} error={getError('street')} icon={faLocationArrow} changeHandler={onChange} />

            <InputField type='text' label='Town' name='town' value={town} error={getError('town')} icon={faMap} changeHandler={onChange} />

            <InputField type='text' label='Postal code' name='postalcode' value={postalcode} error={getError('postalcode')} icon={faAddressCard} changeHandler={onChange} />

            <InputField type='text' label='City' name='city' value={city} error={getError('city')} icon={faCity} changeHandler={onChange} />

            <InputField type='text' label='Country' name='country' value={country} error={getError('country')} icon={faGlobe} changeHandler={onChange} />

            <Button loading={loading} icon={faCloudArrowUp} text='SUBMIT' />
        </form>
    )
};

Signupform.propTypes = {
    formData: PropTypes.object,
    passwordError: PropTypes.bool,
    formError: PropTypes.object,
    errors: PropTypes.array,
    loading: PropTypes.bool
}

export default Signupform;