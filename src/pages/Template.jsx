  import React, { useEffect, useState } from 'react';
  import { useCookies } from 'react-cookie';
  import { useLocation } from 'react-router-dom';
  import { Box, Image, SimpleGrid, Text, Divider, Button, IconButton, useDisclosure, useToast,Select,Heading} from '@chakra-ui/react';
  import { Favorite, FavoriteBorder, Info } from '@mui/icons-material';
  import StarRatings from 'react-star-ratings';
  import Slider from 'react-slick';
  import Comment from '../components/Comment';
  import ReviewModal from '../components/ReviewModal';
  import { useCartContext } from '../contexts/CartContext';
  import { useUserContext } from '../contexts/UserContext';
  import useGetFavoriteStatus from '../hooks/useGetFavoriteStatus';
  import { getTemplateById } from '../services/TemplateServices';
  import { addFavorite, deleteFavorite } from '../services/UserServices';
  import { getCommentByProductId } from '../services/CommentServices';
  import { getRatingByProductId } from '../services/RatingServices';
  import useGetUserHaveThis from '../hooks/useGetUserHaveThis';
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
    const [status] = useGetFavoriteStatus(currentUser, location.state.productId);
    const [isFavorite, setIsFavorite] = useState(false);
    const [ratings, setRatings] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [template, setTemplate] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [description, setDescription] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    const [cookies, setCookies, removeCookie] = useCookies(['cart']);
    const [have] = useGetUserHaveThis(currentUser, location.state.productId);

    useEffect(() => {
      setIsFavorite(status);
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

      /*cart.forEach((item) => {
        if (item.id === location.state.Id) {
          setInCart(true);
          setAmount(item.amount);
        }
      });*/
    }, [location.state.productId, status, cart]);

    const onClickFavorite = () => {
      if (isFavorite) {
        deleteFavorite(currentUser, location.state.productId);
        setIsFavorite(false);
      } else {
        addFavorite(currentUser, location.state.productId);
        setIsFavorite(true);
      }
    };

    const onClickAddCart = () => {
      if (selectedSizes !== "") {
        const currentIndex = cart.findIndex(item => item.id === location.state.productId);
        if (currentIndex >= 0) {
          cart[currentIndex].amount += 1;
          cart[currentIndex].price = template.price * cart[currentIndex].amount;
          setAmount(amount + 1);
          setCookies('cart', cart, { path: '/' });
        } else {
          setCart([...cart, {
            id: location.state.productId,
            amount: 1,
            price: template.price
          }]);
          setCookies('cart', cart, { path: '/' });
        }
        setRefresh(!refresh);
      } else {
        toast({
          title: 'Error!',
          description: 'You must choose a size.',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    };

    const onClickRemoveCart = () => {
      const currentIndex = cart.findIndex(item => item.id === location.state.productId);
      if (currentIndex >= 0) {
        if (cart[currentIndex].amount === 1) {
          const newCart = new Array([]);
          cart.forEach((item, index) => {
            index !== currentIndex && newCart.push(item);
          })
          if (cart.length === 1) {
            removeCookie('cart', { path: '/' });
          } else {
            setCookies('cart', newCart, { path: '/' });
          }
          setInCart(false);
          setCart(newCart);
          setAmount(amount - 1);
        } else {
          cart[currentIndex].price -= cart[currentIndex].price / cart[currentIndex].amount;
          cart[currentIndex].amount -= 1;
          setAmount(amount - 1);
          setCookies('cart', cart, { path: '/' });
        }
      }
      setRefresh(!refresh);
    };

    const onClickWrite = () => {
      if (have) {
        onOpen(true);
      } else {
        toast({
          title: 'Error!',
          description: 'You must have this to write a review.',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    };

    return (
      <>
        <Box p={{ base: 3, md: 10 }}  >
          <Box display='flex' justifyContent='center'>
            <SimpleGrid width={1140} columns={{ base: 1, md: 2 }} gap={10} >
                <Slider {...settings} style={{ width: '100%', margin: '0 auto' }}>
                  {template.templateImages && template.templateImages.map((image, index) => (
                      <div key={index} style={{ height: '100%', width: '100%' }}>
                        <Image
                            key={`${image.id}`}
                            style={{ height: '100%', width: '100%' }}
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
                  <StarRatings
                    starDimension={'20'}
                    starSpacing={'2'}
                    rating={ratings}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    name='rating' />
                  <Text fontSize={16} fontWeight={500} mb={0} >&nbsp;{ratingCount} reviews</Text>
                </Box>
                <Text mt={5} fontSize={28} fontWeight={400} color='facebook.500' >Price : <b> {template.pricePlusPerOne}$ </b> </Text>
                <Divider />
                <Text mt={3} fontSize={20} fontWeight={500} >Sizes</Text>
                <Select
                    placeholder='Select Size'
                    onChange={(event) => {
                      setSelectedSizes(selectedSizes);
                    }}
                >
                  {sizes.map((item, index) => (
                      <option  key={index} value={item.id}>
                        {`${item.width}x${item.length}`}
                      </option>
                  ))}
                </Select>
                <Box
                  mt={10} mb={5}
                  display='flex'
                  flexDirection={{ base: 'column', sm: 'row' }}
                >
                  {
                    inCart
                      ?
                      <Box display='flex' alignItems='center' width={{ base: '100%', sm: '40%' }} >
                        <Button onClick={onClickRemoveCart} disabled={amount === 0} colorScheme='facebook'>-</Button>
                        <Text fontSize={25} px={2} width={{ base: '100%', sm: '60%' }} textAlign='center' >{amount}</Text>
                        <Button onClick={onClickAddCart} colorScheme='facebook' >+</Button>
                      </Box>
                      :
                      <Button
                        onClick={onClickAddCart}
                        my={1}
                        me={{ base: 0, md: 2 }}
                        maxWidth={530}
                        colorScheme='facebook'
                        height={10}
                        width='100%'
                        borderRadius={50}
                        className="custom-button"
                      >Make This Photo</Button>
                  }
                  <IconButton
                    icon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={onClickFavorite}
                    ml={1} my={1}
                    colorScheme='facebook'
                    variant='outline'
                    height={10}
                    width='50px'
                    textAlign='center'
                    display={{ base: 'none', sm: 'block' }} />
                  <Button
                    my={1}
                    colorScheme='facebook'
                    variant='outline'
                    display={{ base: 'block', sm: 'none' }}
                    height={10}
                    width='100%'> ADD TO FAVORITE</Button>
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
                  <StarRatings
                    starDimension={'20'}
                    starSpacing={'2'}
                    rating={ratings}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    name='rating' />
                  <Text fontSize={16} fontWeight={500} > | {ratingCount} reviews</Text>
                </Box>
                <Text my={3} display='flex' alignItems='center' ><Info sx={{ fontSize: '16px', mr: 1 }} /> You must have purchased the product for write a review.  </Text>
              </Box>
              <Button ml={2} mr={{ base: 0, md: 5 }} height={50} colorScheme='facebook' onClick={onClickWrite} >
                Write a Review
              </Button>
            </Box>
            {
              comments.map((comment) => {
                return <Comment key={comment.id} authorId={comment.userId} commentText={comment.content} createdAt={comment.reviewDate} />
              })
            }
          </Box>
        </Box>
        <ReviewModal isOpen={isOpen} onClose={onClose} productId={location.state.productId} />
      </>
    )
  }

  export default Template;