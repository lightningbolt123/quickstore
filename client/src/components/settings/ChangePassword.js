import PropTypes from 'prop-types';
import { useState } from 'react';
import InputField from '../layout/InputField';
import Button from '../layout/Button';
import { faLock, faCheck } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = ({ loading, errors }) => {
    return (
        <form className='dashboard-form'>
            <h1>Change your password</h1>
            <InputField type='password' label='Password*' icon={faLock}/>
            <InputField type='password' label='Repeat password*' icon={faLock} />
            <Button text='SUBMIT' loading={loading} icon={faCheck} />
        </form>
    )
}

ChangePassword.propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.array
}

export default ChangePassword;