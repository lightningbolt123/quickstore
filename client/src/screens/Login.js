import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import InputField from '../components/layout/InputField';
import Button from '../components/layout/Button';
import { faEnvelope, faUserCircle, faLock, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loginUser, clearMessages } from '../reducers/authSlice';
import FormAlert from '../components/layout/FormAlert';
import OTPCheck from '../components/auth/OTPCheck';

const Login = () => {
    const [ formData, setFormData ] = useState({
        email:'',
        password:''
    });

    const { email, password } = formData;

    const dispatch = useDispatch();
    const { errors, message, loading, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (JSON.stringify(message) !== '{}' && !message.activation_status) {
            setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
        }
    },[dispatch, message]);

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
        const data = { email, password };
        dispatch(loginUser(data));
    }

    if (isAuthenticated && localStorage.getItem("token")) return <Navigate to="/dashboard" />

    if (message.activation_status && message.activation_status === 'pending') return <OTPCheck loading={loading} message={message} phonenumber ={message&& message.data.phonenumber} />
    
    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <FontAwesomeIcon style={{ backgroundColor: 'inherit', color: '#2596be', marginTop: '20px' }} size='8x' icon={faUserCircle} />
            {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}
            <InputField type='text' label='Email' name='email' value={email} changeHandler={onChange} error={getError('email')} icon={faEnvelope} />
            <InputField type='password' label='Password' name='password' value={password} changeHandler={onChange} error={getError('password')} icon={faLock} />
            <Button text='LOGIN' loading={loading} icon={faArrowRightToBracket} />
        </form>
    );
}

export default Login;