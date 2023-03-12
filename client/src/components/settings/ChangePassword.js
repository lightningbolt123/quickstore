import PropTypes from 'prop-types';
import { useState } from 'react';
import PasswordInputField from '../layout/PasswordInputField';
import Button from '../layout/Button';
import { faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { changePassword, clearMessages } from '../../reducers/authSlice';
import Header from '../layout/Header';

const ChangePassword = ({ loading, errors }) => {
    const [ formData, setFormData ] = useState({
        password:'',
        password2:''
    });

    const [ passwordError, setPasswordError ] = useState(false);

    const dispatch = useDispatch();

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const { password, password2 } = formData;

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (password === password2) {
            const result = dispatch(changePassword(formData));
            if (result) {
                setTimeout(() => {
                    dispatch(clearMessages());
                }, 3000);
            }
        } else {
            setPasswordError(current => !current);
            setTimeout(() => {
                setPasswordError(current => !current);
            }, 3000);
        }
    }
    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Change your password' />
            <PasswordInputField type='password' label='Password*' name='password' value={password} passwordError={passwordError} error={getError("password")} changeHandler={onChange} icon={faLock}/>
            <PasswordInputField type='password' label='Repeat password*' name='password2' value={password2} passwordError={passwordError} changeHandler={onChange} icon={faLock} />
            <Button text='SUBMIT' loading={loading} icon={faCheck} />
        </form>
    )
}

ChangePassword.propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.array
}

export default ChangePassword;