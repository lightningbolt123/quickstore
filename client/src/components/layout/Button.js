import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Button = ({ loading = false, icon, text, action = () => {}, color='button-green' }) => {
    return (
        <div className='form-group'>
            <button onClick={action} className={color}>{text} {loading && loading ? (
                <FontAwesomeIcon className='spinner' icon={faSpinner} />
            ) : (
                <FontAwesomeIcon className='icon-style' icon={icon} />
            )}</button>
        </div>
    )
};

Button.propTypes = {
    loading: PropTypes.bool,
    icon: PropTypes.object,
    text: PropTypes.string,
    action: PropTypes.func
}
export default Button;