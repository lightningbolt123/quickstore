import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditProfile from '../components/settings/EditProfile';
import ChangePassword from '../components/settings/ChangePassword';
import { loadUser } from '../reducers/authSlice';
import ProfilePicture from '../components/settings/ProfilePicture';

const Settings = () => {
    const { errors, accountUpdating, passwordChangeLoading, photoUploadMessage, isAuthenticated, user, message } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && user === null) {
            dispatch(loadUser());
        } else if (!isAuthenticated) {
            dispatch(loadUser());
        }
    }, [dispatch, isAuthenticated, user]);

    return (
        <Fragment>
            <ProfilePicture message={photoUploadMessage} photo={user? user.photo.secure_url : ''} />
            <EditProfile errors={errors} loading={accountUpdating} user={user} message={message} />
            <ChangePassword loading={passwordChangeLoading} errors={errors} />
        </Fragment>
    )
}

export default Settings;