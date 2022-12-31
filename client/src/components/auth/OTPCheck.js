import PropTypes from 'prop-types';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../layout/Button';

const OTPCheck = ({ loading, errors }) => {
    return (
        <form>
            <span style={{ color: '#555', fontSize: '24px' }}>Verify OTP</span>
            
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
                <div className='input-group' style={{ width: '40px' }}>
                    <input type='text' style={style} />
                </div>
            </div>

            <Button loading={loading} icon={faCheck} text='VERIFY' />
        </form>
    )
};

OTPCheck.propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.array
};

const style = {
    fontSize: '24px',
    textAlign: 'center'
};

export default OTPCheck;