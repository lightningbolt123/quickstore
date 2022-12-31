import { Fragment } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'

const PhoneInputField = ({ label, name, value, changeHandler }) => {
    return (
        <div className='form-group'>
            <label>{label}</label><br />
            <div className='input-group'>
                <PhoneInput defaultCountry='DE' value={value} onChange={(value) => changeHandler(value)} className='PhoneInput' />
            </div>
            {value && isPossiblePhoneNumber(value) ? '' : (
                <Fragment>
                    <span style={{ float: 'left', color: 'red' }}>This phone number is invalid</span><br />
                </Fragment>
            ) }
        </div>
    )
}

export default PhoneInputField;