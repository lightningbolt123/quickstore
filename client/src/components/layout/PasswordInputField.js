import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PasswordInputField = ({ label, name, value, changeHandler, type, icon, passwordError, error }) => {
    return (
        <div className='form-group'>
            <label style={{ float: 'left' }}>{label}</label><br />
            <div className='input-group'>
                <FontAwesomeIcon style={{ margin: '5px', float: 'left' }} icon={icon} />
                <input type={type} name={name} value={value} onChange={(e) => changeHandler(e)} />
            </div>
            {passwordError && passwordError ? (
            <Fragment>
                <span style={{ float: 'left', color: 'red' }}>Both passwords must be the same</span><br />
            </Fragment>): ''}
            {error && error ? (
                <Fragment>
                    <span style={{ float: 'left', color: 'red' }}>{error.msg}</span><br />
                </Fragment>
            ): ''}
        </div>
    )
};

export default PasswordInputField;