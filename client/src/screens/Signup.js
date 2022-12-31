import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Signupform from '../components/auth/Signupform';
import OTPCheck from '../components/auth/OTPCheck';

const Signup = () => {
    const { message, loading, user, errors } = useSelector((state) => state.auth);

    if (JSON.stringify(message) === '{}') {
        return (
            <Fragment>
                <Signupform errors={errors} loading={loading} />
                <OTPCheck loading={loading} errors={errors} />
            </Fragment>
        );
    } else if (message && message.status === 'processing request') {
        return (<OTPCheck loading={loading} errors={errors} />);
    } else if (message && message.status === 'activation successful') {}
}

export default Signup;