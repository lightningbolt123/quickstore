import spinner_04 from '../spinner_04.gif';

const Spinner = () => {
    return (
        <img src={spinner_04} style={spinnerStyle} alt='loading...' />
    );
}

const spinnerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '50px',
};

export default Spinner;