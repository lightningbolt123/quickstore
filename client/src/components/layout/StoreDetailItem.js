import PropTypes from 'prop-types';

const StoreDetailItem = ({ data, label }) => {
    return (
        <p>
            <span style={{ float: 'left', fontWeight: 'bold' }}>{label}</span>
            <span style={{ float: 'right', textAlign: 'left' }}>{data}</span>
        </p>
    );
}

StoreDetailItem.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string
}

export default StoreDetailItem;