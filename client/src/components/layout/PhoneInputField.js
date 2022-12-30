import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'

const PhoneInputField = ({ label, value, changeHandler }) => {
    return (
        <div className='form-group'>
            <label>{label}</label><br />
            <div className='input-group'>
                <PhoneInput defaultCountry='DE' value={value} onChange={(value) => changeHandler(value)} className='PhoneInput' />
            </div>
            <span style={{ float: 'left', color: isPossiblePhoneNumber(value) ? 'green': 'red' }}>{value && isPossiblePhoneNumber(value) ? 'This phone number is valid' : 'This phone number is not valid.'}</span><br />
        </div>
    )
}

export default PhoneInputField;