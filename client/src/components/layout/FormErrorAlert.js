import PropTypes from 'prop-types';

const FormErrorAlert = ({ error }) => {
    return (
        <div className='form-error'>
            <span>{error.msg}</span><br />
        </div>
    )
}

FormErrorAlert.propTypes = {
    error: PropTypes.object
}

export default FormErrorAlert;