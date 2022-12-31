import PropTypes from 'prop-types';
import { useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../layout/Button';
import NumberField from '../layout/NumberField';
import FormErrorAlert from '../layout/FormErrorAlert';

const OTPCheck = ({ loading, errors, message }) => {
    const [formData, setFormData] = useState({
        box1:'',
        box2:'',
        box3:'',
        box4:'',
        box5:'',
        box6:''
    });

    const onChange = (e) => {
        if (e.target.value.length < 2 && !isNaN(e.target.value)) {
            setFormData({ ...formData, [e.target.name]:e.target.value });
        }
    }

    const {
        box1,
        box2,
        box3,
        box4,
        box5,
        box6
    } = formData;

    const onSubmit = (e) => {
        e.preventDefault();
        const otp = `${box1}${box2}${box3}${box4}${box5}${box6}`;
        let phonenumber;
        if (message && message.data) {
            phonenumber = message.data.phonenumber;
        }
        const newData = { otp };
        if (phonenumber) newData.phonenumber = phonenumber;
        console.log(newData);
    }
    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <span style={{ color: '#555', fontSize: '24px' }}>Verify OTP</span>

            {errors && errors ? '' : (<FormErrorAlert error={errors[0]} />)}
            
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Object.entries(formData).map(([key, value], index) => (
                    <NumberField key={index} name={key} value={value} changeHandler={onChange} />
                ))}
            </div>

            <Button loading={loading} icon={faCheck} text='VERIFY' />
        </form>
    )
};

OTPCheck.propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.array,
    message: PropTypes.object
};

export default OTPCheck;