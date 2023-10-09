import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

import { getAllCategories } from '../services/CategoryServices';
import { useSearchContext } from '../contexts/SearchContext';

const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Carousel = () => {
    const navigate = useNavigate();
    const { setSearch } = useSearchContext();
    const [categories, setCategory] = useState([]);
    const [slider, setSlider] = useState("");

    const top = useBreakpointValue({ base: '90%', sm: '50%' });
    const side = useBreakpointValue({ base: '10px', sm: '20px' });

    const sliderWidth = '100vw'; // Đặt chiều rộng slider là 100% chiều rộng của cửa sổ trình duyệt

    useEffect(() => {
        getAllCategories()
            .then((result) => {
                setCategory(result.result);
            });
    }, []);

    const onClickImage = () => {
        setSearch('a');
        navigate('/search');
    }

    return (
        <Box
            mt={10}
            position="relative"
            width={sliderWidth}
            overflow="hidden"
        >
            <IconButton
                color="black"
                position="absolute"
                left={0}
                top={top}
                zIndex={2}
                onClick={() => slider.slickPrev()}
            >
                <ArrowBackIos />
            </IconButton>
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {categories &&
                    categories.map((item,index) =>
                         {
                            return (
                                <Box
                                    onClick={onClickImage}
                                    key={index}
                                    height={{sm:180, md:300, lg:400}}
                                    width="100%"
                                    position="relative"
                                    backgroundPosition="center"
                                    backgroundRepeat="no-repeat"
                                    backgroundSize="cover"
                                    backgroundImage={`url(${process.env.REACT_APP_API_BASE_URL_LOCAL}${item.imageUrl})`}
                                    cursor="pointer"
                                />
                            );
                        }
                    )}
            </Slider>
            <IconButton
                aria-label="right-arrow"
                color="black"
                position="absolute"
                right={0}
                top={top}
                zIndex={2}
                onClick={() => slider.slickNext()}
            >
                <ArrowForwardIos />
            </IconButton>
        </Box>
    );
}

export default Carousel;