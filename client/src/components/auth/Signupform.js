import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import InputField from '../layout/InputField';
import { faUser, faEnvelope, faLock, faHouse, faLocationArrow, faMap, faCity, faGlobe, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import PhoneInputField from '../layout/PhoneInputField';
import { signupUser } from '../../reducers/authSlice';

const Signupform = () => {
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

    const dispatch = useDispatch();

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
        }
    }

    return (
        <form onSubmit={(e) => onSubmitHandler(e)}>
            <span style={{ color: '#555', fontSize: '24px' }}>Signup</span>
            
            <InputField type='text' label='Firstname' name='firstname' value={firstname} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Lastname' name='lastname' value={lastname} changeHandler={onChange} icon={faUser} />

            <InputField type='text' label='Email' name='email' value={email} changeHandler={onChange} icon={faEnvelope} />

            <PhoneInputField label='Phone number' value={phonenumber} changeHandler={onChangePhone} />

            <InputField type='password' label='Password' name='password' value={password} icon={faLock} changeHandler={onChange} />

            <InputField type='password' label='Repeat password' name='password2' value={password2} icon={faLock} changeHandler={onChange} />

            <InputField type='text' label='House' name='house' value={house} icon={faHouse} changeHandler={onChange} />

            <InputField type='text' label='Street' name='street' value={street} icon={faLocationArrow} changeHandler={onChange} />

            <InputField type='text' label='Town' name='town' value={town} icon={faMap} changeHandler={onChange} />

            <InputField type='text' label='Postal code' name='postalcode' value={postalcode} icon={faAddressCard} changeHandler={onChange} />

            <InputField type='text' label='City' name='city' value={city} icon={faCity} changeHandler={onChange} />

            <InputField type='text' label='Country' name='country' value={country} icon={faGlobe} changeHandler={onChange} />

            <div className='form-group'>
                <button className='button-green'>SUBMIT</button>
            </div>
        </form>
    )
};

export default Signupform;