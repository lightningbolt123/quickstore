import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const SmallButton = ({ loading = false, icon, text, float='', color='button-small-blue', onClickHandler }) => {
    return (
        <div className='form-group'>
            <button style={{ float: float }} onClick={(e) => onClickHandler(e)} className={color}>{text} {loading && loading ? (
                <FontAwesomeIcon className='spinner' icon={faSpinner} />
            ) : (
                <FontAwesomeIcon className='icon-style' icon={icon} />
            )}</button>
        </div>
    )
};

SmallButton.propTypes = {
    loading: PropTypes.bool,
    icon: PropTypes.object,
    text: PropTypes.string,
    onClickHandler: PropTypes.func
}
export default SmallButton;