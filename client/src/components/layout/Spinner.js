import spinner_01 from '../spinner_01.gif';

const Spinner = () => {
    return (
        <form>
            <img src={spinner_01} style={spinnerStyle} alt='loading...' />
        </form>
    );
}

const spinnerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px',
    marginBottom: '30px'
};

export default Spinner;