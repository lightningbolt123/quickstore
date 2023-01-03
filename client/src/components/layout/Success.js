import success_tick_01 from '../success_tick_01.gif';

const Success = () => {
    return (
        <div className='success-box-style'>
            <span style={{ color: '#555', fontSize: '24px' }}>OTP verification successful</span>
            <img src={success_tick_01} className='success-style' alt='loading' />
        </div>
    )
}

export default Success;