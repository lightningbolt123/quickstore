import PropTypes from 'prop-types';
import { useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import Button from '../layout/Button';
import NumberField from '../layout/NumberField';
import FormAlert from '../layout/FormAlert';
import { verifyUser } from '../../reducers/authSlice';

const OTPCheck = ({ loading, message, phonenumber }) => {
    const [formData, setFormData] = useState({
        box1:'',
        box2:'',
        box3:'',
        box4:'',
        box5:'',
        box6:''
    });

    const dispatch = useDispatch();

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
        const data = { otp, phonenumber };
        dispatch(verifyUser(data));
    }
    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <span style={{ color: '#555', fontSize: '24px' }}>Verify OTP</span>
            
            {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}
            
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
    message: PropTypes.object,
    phonenumber: PropTypes.string
};

export default OTPCheck;