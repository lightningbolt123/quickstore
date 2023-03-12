import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import FormAlert from '../layout/FormAlert';
import { photoUpload } from '../../reducers/authSlice';
import { clearMessages, loadUser } from '../../reducers/authSlice';
import Header from '../layout/Header';

const ProfilePicture = ({ user, message }) => {
    const [ picture, setPicture ] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && user.photo) {
            setPicture(user.photo.secure_url ? user.photo.secure_url : '');
        } else {
            dispatch(loadUser());
        }
    },[user, dispatch]);

    const onChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPicture(reader.result);
            const data = {
                photo: reader.result
            }
            const response = dispatch(photoUpload(data));
            if (response) {
                setTimeout(() => {
                    dispatch(clearMessages());
                },3000);
            }
        }
    }
    
    return (
        <form className='dashboard-form'>
            <Header text='Profile picture' /><br />
            {JSON.stringify(message) !== '{}' ? <FormAlert alert={message} /> : ''}
            <label htmlFor='profile-picture' style={{ marginLeft: 'auto', marginRight: 'auto'}}>
                {picture ? <img src={picture} style={imageStyle} alt='avatar' /> : <FontAwesomeIcon style={{ backgroundColor: 'inherit', color: '#2596be' }} size='10x' icon={faUserCircle} />}
            </label>
            <input type='file' style={{ display: 'none' }} id='profile-picture' onChange={(e) => onChange(e)} name='profile-picture' />
        </form>
    )
}

ProfilePicture.propTypes = {
    message: PropTypes.object,
    user: PropTypes.object
}

const imageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '100px'
}

export default ProfilePicture;