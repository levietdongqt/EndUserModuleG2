import { Box, Image } from '@chakra-ui/react';
import Slider from 'react-slick';
const ShowAlbum = ({images}) => {

  const settings = {
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,

  };
  return (
    <>
      <Box display='flex' justifyContent='center'>
        <Slider {...settings} style={{ width: '200px', margin: '0 auto' }}>
          {images && images.map((image, index) => (
            <div key={index} style={{ height: '100%', width: '100%' }}>
              <Image
                key={`${image.id}`}
                style={{ height: '150px', width: '200px' }}
                objectFit={'cover'}
                src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${image}`}
              />
            </div>
          ))}
        </Slider>
      </Box>
    </>
  )
}
export default ShowAlbum;