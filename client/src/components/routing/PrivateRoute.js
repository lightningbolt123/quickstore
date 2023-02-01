import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import { loadUser } from '../../reducers/authSlice';

const PrivateRoute = ({ children, component: Component }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.auth);
  
    if (loading) return <Spinner />
    if (isAuthenticated) return <Component />
    return children;
}

export default PrivateRoute;