import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditProfile from '../components/settings/EditProfile';
import ChangePassword from '../components/settings/ChangePassword';

const Settings = () => {
    const { errors, loading } = useSelector((state) => state.auth);
    return (
        <Fragment>
            <EditProfile errors={errors} loading={loading} />
            <ChangePassword loading={loading} errors={errors} />
        </Fragment>
    )
}

export default Settings;