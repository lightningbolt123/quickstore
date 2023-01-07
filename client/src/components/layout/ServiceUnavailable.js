import out_of_service from '../out_of_service.jpg';

const ServiceUnavailable = () => {
    return (
        <div className='success-box-style'>
            <img src={out_of_service} style={style} alt='service unavailable' />
        </div>
    )
}

const style = {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '100px',
    marginBottom: '100px',
    width: '300px',
    height: '200px'
}

export default ServiceUnavailable;