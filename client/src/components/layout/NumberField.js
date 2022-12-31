import PropTypes from 'prop-types';

const NumberField = ({ name, value, changeHandler }) => {
    return (
        <div className='input-group' style={{ width: '40px' }}>
            <input type='text' name={name} value={value} onChange={(e) => changeHandler(e)} style={style} />
        </div>
    )
};

const style = {
    fontSize: '24px',
    textAlign: 'center'
};

NumberField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    changeHandler: PropTypes.func
}

export default NumberField;