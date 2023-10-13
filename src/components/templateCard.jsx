import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Image, Text, Icon, Button, useDisclosure, Select,MenuItem } from '@chakra-ui/react';
import { Favorite, RateReview, ShoppingCart } from '@mui/icons-material';
import Slider from 'react-slick';
import { useCartContext } from '../contexts/CartContext';
import { useUserContext } from '../contexts/UserContext';
import { getTemplateById } from '../services/TemplateServices';
import {getAllize} from "../services/SizeServices";
import { addFavorite, deleteFavorite } from '../services/UserServices';
import useGetFavoriteStatus from '../hooks/useGetFavoriteStatus';
import ReviewModal from './ReviewModal';


const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const TemplateCard = ({ collectionId, isDelivered}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cookies, setCookies, removeCookie] = useCookies(['cart']);
    const { cart, setCart, refresh, setRefresh } = useCartContext();
    const { currentUser } = useUserContext();
    const [status] = useGetFavoriteStatus(currentUser, collectionId);
    const navigate = useNavigate();
    const [sizes,setSizes] = useState([]);
    const [template, setTemplate] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    const [sizeSelected,setSizeSelected] = useState([]);
    useEffect(() => {
        if (collectionId) {
            setIsFavorite(status);
            getTemplateById(collectionId).then((result) => {
                setTemplate(result.result);
            })
            getAllize().then((result) => {
                setSizes(result.result);
            })
            cart.forEach((item) => {
                if (item.id === collectionId) {
                    setInCart(true);
                    setAmount(item.amount);
                }})
        }
    }, [collectionId, status, cart, amount]);


    const onClickFavorite = () => {
        if (!isFavorite) {
            addFavorite(currentUser, collectionId);
            setIsFavorite(true);
        } else {
            deleteFavorite(currentUser, collectionId);
            setIsFavorite(false);
        }
    };

    const onClickAddCart = () => {
        const currentIndex = cart.findIndex(item => item.id === collectionId);
        if (currentIndex >= 0) {
            cart[currentIndex].amount += 1;
            cart[currentIndex].price = template.price * cart[currentIndex].amount;
            setAmount(amount + 1);
            setCookies('cart', cart, { path: '/' });
        } else {
            setCart([...cart, {
                id: collectionId,
                amount: 1,
                price: template.price
            }]);
            setCookies('cart', cart, { path: '/' });
        }
        setRefresh(!refresh);
    };

    return (
        <>
            {template.length > 0 && (
                <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    flexDirection='column'
                    cursor='pointer'
                    mt={{ base: 3, sm: 0 }}
                    mx={{ base: 0, md: 2 }}
                >
                    {template.map((item) => (
                        <Slider key={item.id} {...settings} style={{ width: '358px', margin: '0 auto' }}>
                            {item.templateImages.map((image, index) => (
                                <div key={image.id} style={{ height: '100%', width: '100%' }}>
                                    <Image
                                        key={`${index}`}
                                        style={{ height: '200px', width: '340px' }}
                                        objectFit='cover'
                                        src={image.imageUrl} // Use the image URL from your data
                                        onClick={() =>
                                            navigate(`/template/${item.id}`, {
                                                state: { productId: item.id },
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </Slider>
                    ))}
                    <Box px={3} py={5} bg='#fff' position='relative' width='100%' height={200} maxWidth={500}>
                        <Text
                            onClick={() =>
                                navigate(`/template/${template[0].id}`, {
                                    state: { productId: template[0].id },
                                })
                            }
                            fontWeight={500}
                            fontSize={18}
                        >
                            {template[0]?.name}
                        </Text>
                        {/*<Select
                            multiple
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sizeSelected}
                            onChange={(event)=>{
                                setSizeSelected(event.target.value);
                            }}
                        >
                            {sizes.map((size,index) => (
                                <MenuItem  key={index} value={size} >{`${size.width}x${size.length}`}</MenuItem>
                            ))}
                        </Select>*/}
                        <Box
                            mt={5}
                            py={3}
                            position='absolute'
                            bottom='0px'
                            display='flex'
                            width='100%'
                            justifyContent='space-between'
                            pr={5}
                            pl={2}
                        >
                            <Text
                                onClick={() =>
                                    navigate(`/template/${template[0].id}`, {
                                        state: { productId: template[0].id },
                                    })
                                }
                                fontSize={18}
                                fontWeight={500}
                            >
                                {template[0]?.PricePlus} $
                            </Text>
                            <Box display='flex' alignItems='center' margin='right'>
                                <>
                                    <Icon
                                        onClick={onClickFavorite}
                                        as={Favorite}
                                        fontSize={28}
                                        transition={0.5}
                                        color={!isFavorite ? 'blackAlpha.400' : 'red'}
                                        _hover={{ color: 'red' }}
                                    />
                                    <Button
                                        onClick={onClickAddCart}
                                        fontSize={28}
                                        transition={0.5}
                                        backgroundColor={'#284b9b'}
                                        borderRadius='45px'
                                        boxShadow={'#fff 0px 3px 8px 0px'}
                                        padding={'9px 20px 11px'}
                                        textAlign={'center'}
                                        color='#ffffff'
                                        _hover={{ backgroundColor: '#0b53e6' }}
                                        ms={{ base: 2, md: 5 }}
                                    >
                                        Make this Photo
                                    </Button>
                                </>
                                {isDelivered && (
                                    <Icon
                                        onClick={onOpen}
                                        as={RateReview}
                                        fontSize={36}
                                        transition={0.5}
                                        color='blackAlpha.400'
                                        _hover={{ color: 'facebook.500' }}
                                        ms={{ base: 2, md: 5 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
            <ReviewModal isOpen={isOpen} onClose={onClose} />
        </>

    );
}

export default TemplateCard;