import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Icon, Heading, createLocalStorageManager } from '@chakra-ui/react';
import { ShoppingCart } from '@mui/icons-material';

import { useUserContext } from '../contexts/UserContext';
import { getOrderById, getOrdersByStatus, updateOrderStatus } from '../services/OrderServices';
import OrderCard from '../components/OrderCard';


const Orders = () => {

  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [currentOrders, setCurrentOrders] = useState("active");
  const [orders, setOrders] = useState([]);
  const [puschaseActives, setPurchaseActives] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);



  // useEffect(() => {
  //   getOrdersByStatus(currentUser)
  //     .then((result) => {
  //       var orderArray = result.orders;
  //       setOrders(orderArray.sort((a, b) => (Number(a.orderDate) - Number(b.orderDate))).reverse());

  //       result.orders.forEach((order) => {
  //         if (currentOrders === "active" && order.status) { setIsEmpty(false) };
  //       });

  //     });
  //   if (currentOrders === "all") {
  //     setIsEmpty(false);
  //   }
  // }, [currentUser, currentOrders, setOrders]);

  useEffect(() => {
    const activePurchase = async () => {
      try {
        const statuses = ['Order Placed', 'Order Paid', 'ToShip', 'Received', 'Canceled'];
        const response = await getOrdersByStatus(currentUser.id, statuses);
        console.log(response)
        var purchaseArray = response.result;
        console.log(purchaseArray)
        setPurchaseActives(purchaseArray.sort((a, b) => (Number(a.createDate) - Number(b.createDate))).reverse());

      } catch (error) {
        console.error('error : ', error);
      }

    }
    activePurchase();

  }, []);



  return (
    <Box width='100%' my={10}>
      <Box display='flex' justifyContent='center' p={3} alignItems='center' >
        <Text
          textAlign='center'
          fontSize={30}
          fontWeight={currentOrders === "active" ? 600 : 300}
          color='facebook.500'
          mr={5}
          cursor='pointer'
          onClick={() => setCurrentOrders("active")}
        >Active Orders</Text>
        <Text
          textAlign='center'
          fontSize={30}
          fontWeight={currentOrders === "active" ? 300 : 600}
          color='facebook.500'
          ml={5}
          cursor='pointer'
          onClick={() => setCurrentOrders("all")}
        >All Orders</Text>
      </Box>
      <Box py={3} px={{ base: 3, md: 5, lg: 10 }} >
        {
          puschaseActives.length > 0 ? puschaseActives.map((pur) => {
            if (currentOrders === "active") {
              //showtable ở đây
              return pur.status && <OrderCard key={pur.id} orderId={pur.id} />
            } else {
              return <OrderCard key={pur.id} orderId={pur.id} />
            }
          })
            :
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              flexDirection='column'
              mt={10}
              p={3}
            >
              <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
              <Heading textAlign='center' fontSize={30} mt={8}  >You don't have any orders.</Heading>
              <Text textAlign='center' fontSize={24} mt={2} fontWeight={300} >Check out our bestsellers and find something for you!</Text>
              <Button
                variant='solid'
                fontSize={20}
                px={10} mt={10}
                colorScheme='facebook'
                onClick={() => navigate('/')}>
                Start Shopping
              </Button>
            </Box>
        }
        {
          isEmpty &&
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            mt={10}
            p={3}
          >
            <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
            <Heading textAlign='center' fontSize={30} mt={8}  >You don't have any active orders.</Heading>
            <Text textAlign='center' fontSize={24} mt={2} fontWeight={300} >Check out our bestsellers and find something for you!</Text>
            <Button
              variant='solid'
              fontSize={20}
              px={10} mt={10}
              colorScheme='facebook'
              onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </Box>
        }
      </Box>
    </Box>
  )
}

export default Orders;