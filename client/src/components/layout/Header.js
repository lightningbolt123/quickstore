import PropTypes from 'prop-types';

const Header = ({ text='Header text' }) => {
    return (
        <span className='header-text'>
            {text}
        </span>
    )
};

Header.propTypes = {
    text: PropTypes.string
};

export default Header;