import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Button = ({ loading, icon, text }) => {
    return (
        <div className='form-group'>
            <button className='button-green'>{text} {loading && loading ? (
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
    text: PropTypes.string
}
export default Button;