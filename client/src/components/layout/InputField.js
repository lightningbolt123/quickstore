import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({ label, name, value, changeHandler, type, icon, error, placeholder='' }) => {
    return (
        <div className='form-group'>
            <label style={{ float: 'left' }}>{label}</label><br />
            <div className='input-group'>
                <FontAwesomeIcon style={{ margin: '5px', float: 'left' }} icon={icon} />
                <input type={type} name={name} value={value} onChange={(e) => changeHandler(e)} placeholder={placeholder} />
            </div>
            {error && error ? (
                <Fragment>
                    <span style={{ float: 'left', color: 'red' }}>{error.msg}</span><br />
                </Fragment>
            ): ''}
        </div>
    )
};

export default InputField;