import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import EditProfile from '../components/settings/EditProfile';
import ChangePassword from '../components/settings/ChangePassword';
import ProfilePicture from '../components/settings/ProfilePicture';

const Settings = () => {
    const { errors, accountUpdating, passwordChangeLoading, photoUploadMessage, isAuthenticated, user, message } = useSelector((state) => state.auth);

    return (
        <Fragment>
            <ProfilePicture message={photoUploadMessage} user={user} />
            <EditProfile errors={errors} loading={accountUpdating} user={user} message={message} />
            <ChangePassword loading={passwordChangeLoading} errors={errors} />
        </Fragment>
    )
}

export default Settings;