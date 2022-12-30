import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({ label, name, value, changeHandler, type, icon }) => {
    return (
        <div className='form-group'>
            <label>{label}</label><br />
            <div className='input-group'>
                <FontAwesomeIcon style={{ margin: '5px', float: 'left' }} icon={icon} />
                <input type={type} name={name} value={value} onChange={(e) => changeHandler(e)} />
            </div>
        </div>
    )
};

export default InputField;