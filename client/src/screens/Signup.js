import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Signupform from '../components/auth/Signupform';
import OTPCheck from '../components/auth/OTPCheck';
import Success from '../components/layout/Success';
import Spinner from '../components/layout/Spinner';

const Signup = () => {
    const { message, loading, errors, user } = useSelector((state) => state.auth);

    if (user === null || message.status === 'unauthorized') {
        return <Signupform errors={errors} loading={loading} message={message} />;
    } else if (message.status === 'processing request'
    || message.status === 'activation unsuccessful'
    || message.status === 'not found') {
        return (<OTPCheck loading={loading} message={message} phonenumber ={user.phonenumber} />);
    } else if (message && message.status === 'activation successful') {
        return <Success />
    } else {
        return <Spinner />
    }
}

export default Signup;