import PropTypes from 'prop-types';

const FormAlert = ({ alert }) => {
    return (
        <div className='form-alert' style={{ backgroundColor: alert.status_code === '200' ? 'rgb(5, 204, 55)' : 'rgb(204, 5, 5)' }}>
            <span>{alert.msg}</span><br />
        </div>
    )
}

FormAlert.propTypes = {
    alert: PropTypes.object
}

export default FormAlert;