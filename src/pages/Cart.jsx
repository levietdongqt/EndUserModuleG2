import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Text, Icon, Heading, Button, SimpleGrid, useToast, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody,Td,Image,Input } from '@chakra-ui/react';
import { ShoppingCart } from '@mui/icons-material';

import { getUserById } from '../services/UserServices';
import { useUserContext } from '../contexts/UserContext';
import { useCartContext } from '../contexts/CartContext';
import { getCartInfo,deleteAllCart } from '../services/CartService';
import CollectionCard from '../components/CollectionCard';


const Cart = () => {

  const toast = useToast();
  const { currentUser } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const { cart, setCart, refresh } = useCartContext();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState(cart.map(item => item.quantity));
  const handleQuantityChange = (event, index) => {
    const newQuantities = [...updatedQuantities];
    newQuantities[index] = parseInt(event.target.value, 10); // Chuyển đổi giá trị nhập thành số nguyên
    setUpdatedQuantities(newQuantities);
  };
  useEffect(() => {
    if (currentUser) {
      console.log("User ID", currentUser.id)
      getCartInfo(currentUser.id).then(response => {
        setCookie("cart", response.data.result)
        setCart(response.data.result)
      });
      console.log("CookieCart: ", cart)
    }
  }, []);
  useEffect(() => {
    var price = 0
    var amount = 0;
    cart.forEach((item) => {
      if (item.price && item.quantity) {
        price += item.price * item.quantity;
        amount += item.quantity;
      }
    });
    setTotalPrice(price);
    setTotalAmount(amount);

    currentUser && getUserById(currentUser)
      .then((result) => {
        setUserAddress(result.user.address);
      });
  }, [cart, cookies.cart, refresh, currentUser]);
  const handleChange = () => {
    console.log("Hello");
  }
  const onClickPurchase = () => {
    if (currentUser) {
      if (userAddress) {

        navigate('/payment', { state: { price: totalPrice, address: userAddress } });

      } else {
        navigate('/infos');
        toast({
          title: 'Warning!',
          description: 'You must give your address information first.',
          status: 'warning',
          duration: 2000,
          isClosable: true
        });
      }
    } else {
      navigate('/login');
      toast({
        title: 'Warning!',
        description: 'You must login first.',
        status: 'warning',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const  onClickRemove = async () => {
    setCart([]);
    removeCookie('cart', { path: '/' });
     await deleteAllCart();
  };

  if (currentUser && cart.length >= 1) {
    return (
      <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} >
        <SimpleGrid width='80%' p={{ base: 3, md: 5 }} columns={{ base: 1, sm: 1, md: 1 }} spacing={{ base: 3, md: 5 }} >
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <TableContainer>
              <Table variant='striped' colorScheme='gray'>
                <Thead>
                  <Tr>
                  <Th>No.</Th>
                    <Th>Template</Th>
                    <Th>Image</Th>
                    <Th>Size</Th>
                    <Th>Material</Th>
                    <Th>Amount</Th>
                    <Th>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    cart && cart.map((item, index) => {

                      return (
                        <>
                          <Tr>
                            <Td>{index +1}</Td>
                            <Td>{item.templateName}</Td>
                            <Td><Image w={200} h={150} maxW={'100%'} src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${item.image}`} alt='Images' /></Td>
                            <Td >{`${item.width}X${item.length}`}</Td>
                            <Td >{item.materialPage}</Td>
                            <Td > <Input
                             type="number"
                             value={updatedQuantities[index]}
                             onChange={(e) => handleQuantityChange(e, index)}
                              width={20}
                            /></Td>
                            <Td>$ {item.price * item.quantity}</Td>
                          </Tr>
                        </>
                      )
                    })
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </div>
          {/* {
            cart && cart.map((myImages, index) => {
              return product.id && <ProductCart key={index} productId={product.id} />
            })
          }  */}
        </SimpleGrid>
        <Box my={5} borderLeft={{ base: 'none', md: '2px solid whitesmoke' }} flexDirection='column' display='flex' bg='#fff' width={{ base: '100%', md: '20%' }} px={5} >
          {
            userAddress && <Box my={3} flexDirection='column' display='flex' bg='#fff' width={{ base: '100%' }}  >
              <Text fontSize={28} mt={3} fontWeight={600} color='facebook.500' >Address</Text>
              <Text mt={3} fontSize={24} color='facebook.500' fontWeight={300} >{userAddress}</Text>
            </Box>
          }
          <Text fontSize={28} mt={10} fontWeight={600} color='facebook.500' >Order Details</Text>
          <Text mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Product Amount: {totalAmount}</Text>
          <Text mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Total Price: {totalPrice} $</Text>
          <Button mt={10} colorScheme='facebook' onClick={onClickPurchase} >Purchase</Button>
          <Button mt={3} variant='text' color='facebook.500' onClick={onClickRemove} >Remove All</Button>

        </Box>
      </Box>
    )
  } else if (currentUser) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        my={10}
        p={5}
      >
        <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
        <Heading textAlign='center' fontSize={30} mt={8}  >You have nothing in your cart.</Heading>
        <Text textAlign='center' fontSize={24} mt={3} fontWeight={300} >You haven't added a product to your cart. All you have to do is click on the cart icon.</Text>
        <Button
          variant='solid'
          fontSize={20}
          px={10} mt={10}
          colorScheme='facebook'
          onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Box>
    )
  }
  else {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        my={10}
        p={5}
      >
        <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
        <Heading textAlign='center' fontSize={30} mt={8}  >You have to login first!</Heading>
        <Button
          variant='solid'
          fontSize={20}
          px={10} mt={10}
          colorScheme='facebook'
          onClick={() => navigate('/login')}>
          Login Now
        </Button>
      </Box>
    )
  }
}

export default Cart;