import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Link, Box, Text, Icon, Heading, Button, SimpleGrid, useToast, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Input, Image, Container } from '@chakra-ui/react';
import { ShoppingCart } from '@mui/icons-material';
import { useUserContext } from '../contexts/UserContext';
import { useCartContext } from '../contexts/CartContext';
import { getCartInfo, deleteAllCart, updateToCart, deleteToCart } from '../services/CartService';
import CollectionCard from '../components/CollectionCard';
import ShowAlbum from '../components/ShowAlbum';
import { FcDeleteRow } from 'react-icons/fc';
import { MdDelete } from "react-icons/md";
const Cart = () => {

  const toast = useToast();
  const { currentUser } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const { cart, setCart, refresh } = useCartContext();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState([]);
  const handleQuantityChange = (event, index) => {
    const newUpdatedQuantities = [...updatedQuantities];
    newUpdatedQuantities[index] = event.target.value;
    setUpdatedQuantities(newUpdatedQuantities);
  };
  useEffect(() => {
    if (currentUser) {
      getCartInfo(currentUser.id).then(response => {
        if (response.data.status === 200) {
          setCookie("cart", response.data.result)
          setCart(response.data.result)
        } else {
          setCookie("cart", [])
          setCart([])
        }
      });
      console.log("CookieCart: ", cart)
    }
  }, []);
  useEffect(() => {
    var price = 0
    var amount = 0;
    if (cart.length > 0) {
      var index = 0;
      const newQuantities = [...updatedQuantities];
      cart.forEach((item) => {
        newQuantities[index] = item.quantity;
        index++;
        if (item.price && item.quantity) {
          price += item.price * item.quantity;
          amount += item.quantity;
        }
      });
      setUpdatedQuantities(newQuantities);
      setTotalPrice(price);
      setTotalAmount(amount);
    }
  }, [cart, cookies.cart, refresh, currentUser]);

  const handleDelete = (productId) => {
    if (currentUser) {
      deleteToCart(productId).then((result) => {
        if (result.data.status === 200) {
          toast({
            title: 'Infomation',
            description: 'Delete successfully !',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: "top"
          });
        } else {
          toast({
            title: 'Error',
            description: 'Delete fail, please reload and try again !',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: "top"
          });
        }
      });
    }
  }
  const handleUpdateQuantity = (productId, Index) => {
    if (currentUser) {
      const amount = Number(updatedQuantities[Index]);
      updateToCart(productId, amount).then((result) => {
        if (result.data.status === 200) {
          toast({
            title: 'Infomation',
            description: 'Update quantity successfully !',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: "top"
          });
        } else {
          toast({
            title: 'Error',
            description: 'Update quantity fail, please reload and try again !',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: "top"
          });
        }
      });
    }
  };
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

  const onClickRemove = async () => {
    setCart([]);
    removeCookie('cart', { path: '/' });
    await deleteAllCart();
  };

  if (currentUser && cart && cart.length >= 1 && totalAmount > 0) {
    return (
      <>
        <Heading textAlign='center' fontSize={40} mt={8}  >Photo Card</Heading>
        <Container maxW='1140px'>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} >
            <SimpleGrid width='80%' p={{ base: 3, md: 5 }} columns={{ base: 1, sm: 1, md: 1 }} spacing={{ base: 3, md: 5 }} >
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray' size={"md"}>
                    <Thead >
                      <Tr borderBottom={'2px'} >
                        <Th>Image</Th>
                        <Th>Template</Th>
                        <Th>Size</Th>
                        <Th>Material</Th>
                        <Th>Amount</Th>
                        <Th>Price</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        cart && cart.map((item, index) => {
                          return (
                            <>
                              <Tr key={index}>
                                <Td>
                                  <ShowAlbum images={item.images} /></Td>
                                <Td>
                                  <Text color={'#284b9b'} fontSize={18} fontWeight={700}>{item.templateName}</Text>
                                </Td>
                                <Td >{`${item.width} X ${item.length}`}</Td>
                                <Td >{item.materialPage}</Td>
                                <Td textAlign={'center'}>
                                  <Input
                                    type="number"
                                    value={updatedQuantities[index]}
                                    onChange={(e) => handleQuantityChange(e, index)}
                                    width={20}
                                    border="1px solid"
                                    borderRadius={10}
                                    textAlign="center"
                                    display={'block'}
                                  />
                                  <Button mt={0.5} color='facebook' _hover={{ color: "blue" }} onClick={() => handleUpdateQuantity(item.productId, index)}>Update</Button>
                                </Td>

                                <Td>${(item.price * item.quantity).toFixed(2)}</Td>
                                <Td><Link _hover={{ color: 'red' }} onClick={() => { handleDelete(item.productId) }}><MdDelete fontSize={30} color={'facebook.500'} /></Link></Td>
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
              <Box borderBottom={'2px'}>
                <Text fontSize={22} mt={0} fontWeight={600} color='facebook.500' mb={'0.45rem'} >Order Summary</Text>
              </Box>
              <Text mt={3} fontSize={20} color='facebook.500' fontWeight={100} >Product Amount: {totalAmount}</Text>
              <Text mt={3} fontSize={20} color='black' fontWeight={300} >Total: {totalPrice} $</Text>
              <Button mt={10} colorScheme='facebook' onClick={onClickPurchase} >Purchase</Button>
              <Button mt={3} variant='text' color='facebook.500' onClick={onClickRemove} >Remove All</Button>

            </Box>
          </Box>
        </Container >
      </>

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