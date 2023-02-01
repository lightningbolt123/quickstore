import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SignupForm from '../components/auth/SignupForm';
import OTPCheck from '../components/auth/OTPCheck';
import Success from '../components/layout/Success';

const Signup = () => {
    const { message, loading, errors, user } = useSelector((state) => state.auth);

    if (user === null && message.status === 'unauthorized') return <SignupForm errors={errors} loading={loading} message={message} />;
    if (user === null && message.status === 'service unavailable')  return <SignupForm errors={errors} loading={loading} message={message} />;
    if (user !== null && message.status === 'processing request') return <OTPCheck loading={loading} message={message} phonenumber ={user.phonenumber} />;
    if (user !== null && message.status === 'activation unsuccessful') return <OTPCheck loading={loading} message={message} phonenumber ={user.phonenumber} />;
    if (user !== null && message.status === 'not found') return <OTPCheck loading={loading} message={message} phonenumber ={user.phonenumber} />;
    if (user !== null && message.status === 'service unavailable') return <OTPCheck loading={loading} message={message} phonenumber ={user.phonenumber} />;
    if (message && message.status === 'activation successful') return <Success />
    return <SignupForm errors={errors} loading={loading} message={message} />;
}
export default Signup;