import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Image, Text, Icon, Button, useDisclosure } from '@chakra-ui/react';
import { Favorite, RateReview, ShoppingCart } from '@mui/icons-material';

import { useCartContext } from '../contexts/CartContext';
import { useUserContext } from '../contexts/UserContext';
import { getTemplateById } from '../services/TemplateServices';
import { addFavorite, deleteFavorite } from '../services/UserServices';
import useGetFavoriteStatus from '../hooks/useGetFavoriteStatus';
import ReviewModal from './ReviewModal';

const ClothesCard = ({ templateId, isDelivered}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies, setCookies, removeCookie] = useCookies(['cart']);
  const { cart, setCart, refresh, setRefresh } = useCartContext();
  const { currentUser } = useUserContext();
  const [status] = useGetFavoriteStatus(currentUser, templateId);
  const navigate = useNavigate();

  const [template, setTemplate] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (templateId) {
      setIsFavorite(status);
      getTemplateById(templateId)
        .then(result => {
          setTemplate(result.result);
        });
      cart.forEach((item) => {
        if (item.id === templateId) {
          setInCart(true);
          setAmount(item.amount);
        }
      });
    }
  }, [templateId, status, cart, amount]);

  const onClickFavorite = () => {
    if (!isFavorite) {
      addFavorite(currentUser, templateId);
      setIsFavorite(true);
    } else {
      deleteFavorite(currentUser, templateId);
      setIsFavorite(false);
    }
  };

  const onClickAddCart = () => {
    const currentIndex = cart.findIndex(item => item.id === templateId);
    if (currentIndex >= 0) {
      cart[currentIndex].amount += 1;
      cart[currentIndex].price = template.price * cart[currentIndex].amount;
      setAmount(amount + 1);
      setCookies('cart', cart, { path: '/' });
    } else {
      setCart([...cart, {
        id: templateId,
        amount: 1,
        price: template.price
      }]);
      setCookies('cart', cart, { path: '/' });
    }
    setRefresh(!refresh);
  };

  const onClickRemoveCart = () => {
    const currentIndex = cart.findIndex(item => item.id === templateId);
    if (currentIndex >= 0) {
      if (cart[currentIndex].amount === 1) {
        const newCart = [];
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

  return(<>
    <Box
        width='100%'
        display='flex'
        alignItems='center'
        flexDirection='column'
        cursor='pointer'
        mt={{ base: 3, sm: 0 }}
        mx={{ base: 0, md: 2 }}
    >
      {
          template &&
          template.map((item, index) => {
            const firstImage = item.templateImages[0];
            return (
                <Image
                    key={`${index}-${firstImage.imageUrl}`}
                    width='100%'
                    height='auto'
                    maxWidth={500}
                    objectFit='cover'
                    maxHeight={600}
                    src={firstImage.imageUrl}
                    onClick={() => navigate(`/template/${template[0].id}`, { state: { "productId": template[0].id } })}
                    style={{ height: '260px' }}
                />
            );
          })
      }
      <Box px={3} py={5} bg='#fff' position='relative' width='100%' height={150} maxWidth={500} >
        <Text onClick={() => navigate(`/template/${template[0].id}`, { state: { "productId": template[0].id } })} fontWeight={500} fontSize={18} >{template[0]?.name}</Text>
        <Box
            mt={5}
            py={3}
            position='absolute'
            bottom='0px'
            display='flex'
            width='100%'
            justifyContent='space-between'
            pr={5} pl={2}
        >
          <Text onClick={() => navigate(`/template/${template[0].id}`, { state: { "productId": template[0].id } })} fontSize={18} fontWeight={500} >{template[0]?.pricePlus} $</Text>
          <Box display='flex' alignItems='center' margin='right' >
            {
                  <>
                    <Icon
                        onClick={onClickFavorite}
                        as={Favorite}
                        fontSize={28}
                        transition={.5}
                        color={!isFavorite ? 'blackAlpha.400' : 'red'}
                        _hover={{ color: 'red' }}
                    />
                    <Icon
                        onClick={onClickAddCart}
                        as={ShoppingCart}
                        fontSize={28}
                        transition={.5}
                        color='blackAlpha.400'
                        _hover={{ color: 'facebook.500' }}
                        ms={{ base: 2, md: 5 }}
                    />
                  </>
            }
            {
                isDelivered &&
                <Icon
                    onClick={onOpen}
                    as={RateReview}
                    fontSize={36}
                    transition={.5}
                    color='blackAlpha.400'
                    _hover={{ color: 'facebook.500' }}
                    ms={{ base: 2, md: 5 }}
                />
            }
          </Box>
        </Box>
      </Box>
    </Box>

    <ReviewModal isOpen={isOpen} onClose={onClose} productId={templateId} />
  </>)
}

export default ClothesCard;