import { useEffect, useState } from 'react';

const images = [
    "https://img.freepik.com/free-vector/modern-black-friday-sale-banner-template-with-3d-background-red-splash_1361-1877.jpg",
    "https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Free-Sports-Running-Shoes-Banner-Design.jpg",
    "https://i.pinimg.com/736x/ba/12/70/ba1270340211f837434e537dcacaf242.jpg"
]
const Banner = () => {
    const [ currentIndex, setCurrentIndex ] = useState(0);

    const nextSlide = () => {
        const lastCount = images.length - 1;
        setTimeout(() => {
            if (currentIndex < lastCount) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(0);
            }
        }, 3000);
    }

    useEffect(() => {
        nextSlide();
    },[nextSlide])

    return (
    <div className='banner-container '>
        <img src={images[currentIndex]} className='banner-image' />
    </div>
    )
}

export default Banner;