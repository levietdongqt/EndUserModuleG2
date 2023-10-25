  import React, { useEffect, useState } from 'react';
  import { useCookies } from 'react-cookie';
  import { useLocation } from 'react-router-dom';
  import { ChakraProvider,Box, Image, SimpleGrid, Text, Divider, Button, IconButton, useDisclosure, useToast,Select,Heading} from '@chakra-ui/react';
  import { Favorite, FavoriteBorder, Info } from '@mui/icons-material';
  import StarRatings from 'react-star-ratings';
  import Slider from 'react-slick';
  import Comment from '../components/Comment';
  import ReviewModal from '../components/ReviewModal';
  import { useCartContext } from '../contexts/CartContext';
  import { useUserContext } from '../contexts/UserContext';
  import { getTemplateById } from '../services/TemplateServices';
  import { addFavorite, deleteFavorite } from '../services/UserServices';
  import useGetUserHaveThis from '../hooks/useGetUserHaveThis';
  import {getOrdersByUserId} from "../services/OrderServices";
  import {getAllMaterialPage} from "../services/MaterialPage";
  import Upload from "../pages/Upload";
  import '../style.css';
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", backgroundColor: '#261f15', color: '#fff', borderRadius: '25px', right: '0px' }}
            onClick={onClick}
        />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", backgroundColor: '#261f15', color: '#fff', borderRadius: '25px', left: '-20px' }}
            onClick={onClick}
        />
    );
  }
  const pageStyles = {
    fontFamily: 'Roboto, sans-serif',
  }


  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const Template = () => {

    const toast = useToast();
    const location = useLocation();
    const { cart, setCart, refresh, setRefresh } = useCartContext();
    const { currentUser } = useUserContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    /*const [status] = useGetFavoriteStatus(currentUser, location.state.productId);*/
    const [openUpload,setOpenUpload] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [ratings, setRatings] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [template, setTemplate] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [description, setDescription] = useState([]);
    const [have] = useGetUserHaveThis(currentUser.id, location.state.productId);
    const [hasReview, setHasReview] = useState(false);
    const [meterial, setMeterial] = useState([]);
    const [selectedSizeId, setSelectedSizeId] = useState(0);
    const [selectedMaterialId, setSelectedMaterialId] = useState(0);
    useEffect(() => {
      getTemplateById(location.state.productId)
        .then((result) => {
          setTemplate(result.result);
          setSizes(result.result.sizesDTO);
          setDescription(result.result.descriptionTemplates);
          setComments(result.result.reviews);
          //star
          var star = 0;
          result.result.reviews.forEach((r)=>{
            star += r.rating
          });
          setRatings(star / result.result.reviews.length || 0);
          setRatingCount(result.result.reviews.length);
        });
      getAllMaterialPage().then((result) => {
        if(result.result.forEach((r)=>{
          if(r.status === true){
            setMeterial(result);
          }
        }));
      });
      getOrdersByUserId(currentUser.id).then((result) => {
        result.result.reviews?.forEach((item) => {
              if (item.templateId === location.state.productId && item.userId === currentUser.id) {
                setHasReview(true);
              }
        });
      })
    }, [location.state.productId , cart]);
    const handleCloseDialogEdit = () => {
      setOpenUpload(false);
    }
    const handleUpload = () => {

      if(!currentUser) {
        toast({
          title: 'Waring!',
          description: 'Please login to upload images !',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position : 'top'
        });
      }else{
        setOpenUpload(true)
      }
    }

    const onClickFavorite = () => {
      if (isFavorite) {
        deleteFavorite(currentUser, location.state.productId);
        setIsFavorite(false);
      } else {
        addFavorite(currentUser, location.state.productId);
        setIsFavorite(true);
      }
    };

    const handlePrice = () => {
      if (selectedSizeId && selectedMaterialId) {
        const selectedSize = sizes.find((item) => item.id === Number(selectedSizeId) );
        const selectedMaterial = meterial.result.find((item) => item.id === Number(selectedMaterialId));
        if (selectedSize && selectedMaterial) {
          const price = selectedSize.width * selectedSize.length * selectedMaterial.pricePerInch + template.pricePlusPerOne;
          return price;
        }
      }
      // Nếu không có kích thước hoặc chất liệu được chọn, trả về giá mặc định từ template.pricePlusPerOne
      return template.pricePlusPerOne;
    };

    const onClickWrite = () => {
      if (have) {
        onOpen(true);
      } else {
        toast({
          title: 'Error!',
          description: 'You must have this to write a review.',
          duration: 2000,
          isClosable: true
        });
      }
    };
    return (
      <ChakraProvider>
        <Box p={{ base: 3, md: 10 }}  {...pageStyles}>
          <Box display='flex' justifyContent='center'>
            <SimpleGrid width={1140} columns={{ base: 1, md: 2 }} gap={10} >
              <Slider {...settings} style={{ width: '100%', margin: '0 auto', display: 'flex' }}>
                {template.templateImages && template.templateImages.map((image) => (
                    <div key={`${image.id}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                      <Image
                          style={{
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                            margin: '0 auto',
                            position: 'relative',
                            top: '12rem',
                          }}
                          objectFit={'cover'}
                          src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${image.imageUrl}`}
                      />
                    </div>
                ))}
              </Slider>
              <Box p={3} maxWidth={600} >
                <Text fontSize={40} fontWeight={'bold'}>{template.name}</Text>
                <Box
                  display='flex'
                  alignItems='center'
                  mt={0}>
                  <Text fontSize={16} fontWeight={500} mb={0} pt={1} >{ratings.toFixed(2)} &nbsp;</Text>
                  <StarRatings
                    starDimension={'20'}
                    starSpacing={'2'}
                    rating={ratings}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    name='rating' />

                </Box>
                <Text mt={5} fontSize={28} fontWeight={400} color='facebook.500' >
                  Price : <b> {handlePrice() ? handlePrice().toFixed(2) + '$' : 'N/A'} </b>
                </Text>
                <Divider />
                <Text mt={3} fontSize={20} fontWeight={500} >Sizes</Text>
                <Select
                    placeholder='Select Size'
                    onChange={(event) => setSelectedSizeId(event.target.value)}
                >
                  {sizes.map((item, index) => (
                      <option  key={index} value={item.id} >
                        {`${item.width}x${item.length}`}
                      </option>
                  ))}
                </Select>
                <Text mt={3} fontSize={20} fontWeight={500} >Material Page</Text>
                <Select mt={3} onChange={(event) => setSelectedMaterialId(event.target.value)}
                    placeholder='Select Material Page...'
                >
                  {
                    meterial.result && meterial.result.map((item, index) => (
                      <option key={index} value={item.id} >
                        {item.name}
                      </option>
                  ))}
                </Select>
                <Box
                  mt={10} mb={5}
                  display='flex'
                  flexDirection={{ base: 'column', sm: 'row' }}
                >
                      <Button
                        my={1}
                        me={{ base: 0, md: 2 }}
                        maxWidth={530}
                        colorScheme='facebook'
                        height={10}
                        width='100%'
                        borderRadius={50}
                        className="custom-button"
                        onClick={() => handleUpload()}
                      >Make Your Photos</Button>
                </Box>
                <Divider />
                <Box
                  mt={3}>
                  <Text fontSize={30} fontWeight={500} >Description</Text>
                  <Heading as='h4' size='md'>
                    {description[0]?.title}
                  </Heading>
                  <div dangerouslySetInnerHTML={{ __html: description[0]?.description }} className={'description-home'} ></div>
                </Box>
              </Box>
            </SimpleGrid>
          </Box>
          <Box maxWidth={1200} flexDirection='column' p={{ base: 3, md: 0 }} marginX='auto' >
            <Text mt={10} mb={3} fontSize={40} fontWeight={300} >User Reviews</Text>
            <Box
              width='100%'
              display='flex'
              justifyContent='space-between'
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              backgroundColor='whitesmoke'
              borderRadius='4px'
              px={2} py={5}
              mb={10}
            >
              <Box>
                <Box display='flex'>
                  <Text fontSize={14} fontWeight={500} mt={1.5} mr={2}>{ratings.toFixed(2)} / 5</Text>
                  <StarRatings
                    starDimension={'20'}
                    starSpacing={'2'}
                    rating={ratings}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    name='rating'
                  />
                  <Text fontSize={16} fontWeight={500} ml={2}> {ratingCount} reviews</Text>
                </Box>
                <Text my={3} display='flex' alignItems='center' ><Info sx={{ fontSize: '16px', mr: 1 }} /> You must have purchased the product for write a review.  </Text>
              </Box>
              {
                hasReview ? (
                    <Button
                        ml={2}
                        mr={{ base: 0, md: 5 }}
                        height={50}
                        colorScheme='facebook'
                        isDisabled={true}
                    >
                      Write a Review
                    </Button>
                ) : (
                    <Button
                        ml={2}
                        mr={{ base: 0, md: 5 }}
                        height={50}
                        colorScheme='facebook'
                        onClick={onClickWrite}
                    >
                      Write a Review
                    </Button>
                )
              }
            </Box>
            {
              comments.map((comment) => {
                return <Comment key={comment.id} authorId={comment.userId} commentText={comment.content} createdAt={comment.reviewDate} />
              })
            }
          </Box>
        </Box>
        <ReviewModal isOpen={isOpen} onClose={onClose} productId={location.state.productId}  />
        <Upload openDialog={openUpload} handleCloseDialog={handleCloseDialogEdit} template ={template} />
      </ChakraProvider>
    )
  }

  export default Template;