import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Icon, Heading, createLocalStorageManager, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex } from '@chakra-ui/react';
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


  useEffect(() => {
    const activePurchase = async () => {
      try {
        const statuses = currentOrders === 'active'
          ? ['Order Placed', 'Order Paid', 'ToShip', 'Received', 'Canceled']
          : ['Canceled'];
        const response = await getOrdersByStatus(currentUser.id, statuses);
        var purchaseArray = response.result;
        setPurchaseActives(purchaseArray.sort((a, b) => (Number(a.createDate) - Number(b.createDate))).reverse());

      } catch (error) {
        console.error('error : ', error);
      }

    }
    activePurchase();

  }, [currentOrders]);



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
        >Canceled Orders</Text>
      </Box>
      <Box py={3} px={{ base: 3, md: 5, lg: 10 }}>
        {puschaseActives.length > 0 ? (
          <Box flexDirection={{ base: 'column', sm: 'row' }} >
            <TableContainer maxW="full">
              <Table variant='striped' colorScheme='gray' flexDirection={{ base: 'column', sm: 'row' }}>
                <Thead>
                  <Tr>

                    <Th ><Flex justifyContent="center">
                      Create Date
                    </Flex></Th>
                    <Th ><Flex justifyContent="center">
                      Price Total
                    </Flex></Th>
                    <Th ><Flex justifyContent="center">
                      Status
                    </Flex></Th>
                    <Th ><Flex justifyContent="center">
                      Delivery Information
                    </Flex></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {puschaseActives.map((pur) => {
                    // Kiểm tra lựa chọn của người dùng
                    if (currentOrders === "active") {
                      // Nếu người dùng chọn "Active", hiển thị theo các trạng thái này
                      if (['Order Placed', 'Order Paid', 'ToShip', 'Received'].includes(pur.status)) {
                        return (
                          <OrderCard key={pur.id} orderId={pur.id} deId={pur.deliveryInfoId} />
                        );
                      }
                    } else if (currentOrders === "all") {
                      // Nếu người dùng chọn "All", hiển thị the trạng thái "Canceled"
                      if (pur.status === 'Canceled') {
                        return (
                          <OrderCard key={pur.id} orderId={pur.id} deId={pur.deliveryInfoId} />
                        );
                      }
                    }
                    return null; // Trả về null cho các trạng thái không phù hợp
                  })}
                </Tbody>

              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            mt={10}
            p={3}
          >
            <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
            <Heading textAlign='center' fontSize={30} mt={8}>
              You don't have any orders.
            </Heading>
            <Text textAlign='center' fontSize={24} mt={2} fontWeight={300}>
              Check out our bestsellers and find something for you!
            </Text>
            <Button
              variant='solid'
              fontSize={20}
              px={10}
              mt={10}
              colorScheme='facebook'
              onClick={() => navigate('/')}
            >
              Start Shopping
            </Button>
          </Box>
        )}
        {isEmpty && (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            mt={10}
            p={3}
          >
            <Icon color='#314E89' fontSize={100} as={ShoppingCart} />
            <Heading textAlign='center' fontSize={30} mt={8}>
              You don't have any active orders.
            </Heading>
            <Text textAlign='center' fontSize={24} mt={2} fontWeight={300}>
              Check out our bestsellers and find something for you!
            </Text>
            <Button
              variant='solid'
              fontSize={20}
              px={10}
              mt={10}
              colorScheme='facebook'
              onClick={() => navigate('/')}
            >
              Start Shopping
            </Button>
          </Box>
        )}
      </Box>

    </Box>
  )
}

export default Orders;