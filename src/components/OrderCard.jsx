import React, { useEffect, useState } from 'react';
import {
    Box, Text, Button, Divider, SimpleGrid, useToast, useDisclosure, Table, Thead, Tbody, Tr, Th, Td,
    TableCaption, TableContainer, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody
} from '@chakra-ui/react';
import { Cancel, Error, Info, Person, LocationOn, Phone, Email } from '@mui/icons-material';
import moment from 'moment';
import { getOrderById, updateOrderStatus, getDeliveryById } from '../services/OrderServices';
import CollectionCard from './CollectionCard';
import ReportModal from './ReportCard';


const OrderCard = ({ orderId, deId }) => {

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [products, setProducts] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [date, setDate] = useState("");
    const [totalprice, setTotalprice] = useState("");
    const [deliveryId, setDeliveryId] = useState("");
    const [delivery, setDelivery] = useState({
        email: "",
        phone: "",
        deliveryAddress: "",
        customName: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkUpdate, setCheckUpdate] = useState(0);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        getOrderById(orderId)
            .then((result) => {
                setDate(result.result.createDate);
                setTotalprice(result.result.priceTotal);
                if (result.result.status == "Order Paid") {
                    setOrderStatus("Order is preparing.");
                } else if (result.result.status == "ToShip") {
                    setOrderStatus("Order is on way.");
                } else if (result.result.status == "Received") {
                    setOrderStatus("Order has been delivered.");
                } else if (result.result.status == "Order Placed") {
                    setOrderStatus("Order placed.");
                } else if (result.result.status == "Canceled") {
                    setOrderStatus("Order canceled.");
                }
            });
        getDeliveryById(deId)
            .then((data) => {
                setDelivery((prevDelivery) => ({
                    ...prevDelivery,
                    email: data.result.email,
                    phone: data.result.phone,
                    deliveryAddress: data.result.deliveryAddress,
                    customName: data.result.customName,
                }));
            });

    }, [orderStatus]);


    const onClickCancel = async () => {
        if (orderStatus === "Order placed.") {
            const confirmCancel = window.confirm('Are you sure you want to cancel this order?');

            if (confirmCancel) {
                const purDTO = {
                    id: orderId,
                    status: "Canceled"
                };

                try {
                    const result = await updateOrderStatus(purDTO);
                    if (!result) {
                        toast({
                            title: 'Failed to cancel the order.',
                            description: 'Please try again later.',
                            status: 'error',
                        });
                    } else {

                        setOrderStatus("Order canceled");
                        setCheckUpdate(checkUpdate + 1);
                        toast({
                            title: 'Order Canceled',
                            description: 'Your order has been successfully canceled.',
                            status: 'success',
                        });
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                }
            }
        }
    };

    return (
        <>


            <Tr >

                <Td>
                    <Flex justifyContent="center">
                        <Text fontSize={15} p={2} fontWeight={400} color='facebook.500'>{moment(date).format('DD.MM.YY - hh:mm A')}</Text>
                    </Flex>
                </Td>
                <Td>
                    <Flex justifyContent="center">
                        <Text fontSize={15} p={2} fontWeight={400} color='facebook.500'>{totalprice}</Text>
                    </Flex>
                </Td>
                <Td>
                    <Flex justifyContent="center">
                        <Text fontSize={15} p={2} fontWeight={400} color='facebook.500'>{orderStatus}</Text>
                    </Flex>
                </Td>
                <Td>
                    <Flex justifyContent="center">

                        <Button my={2} colorScheme='facebook' onClick={openModal}>
                            Delivery Information <Info sx={{ ml: 2 }} />
                        </Button>

                    </Flex>
                </Td>
                <Td>
                    <Flex justifyContent="center">
                        {orderStatus === "Order has been delivered." ? (
                            <Button onClick={onOpen} my={2} colorScheme='facebook'>
                                Report Order <Error sx={{ ml: 2 }} />
                            </Button>
                        ) : orderStatus === "Order placed." ? (
                            <Button onClick={onClickCancel} my={2} colorScheme='facebook'>
                                Cancel Order<Cancel sx={{ ml: 2 }} />
                            </Button>
                        ) : (
                            [] // Hiển thị mảng rỗng
                        )}
                    </Flex>
                </Td>
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={closeModal} size="md">
                        <ModalOverlay />
                        <ModalContent p={4}>
                            <ModalHeader fontSize="30px" color="facebook.500" fontWeight="bold">Delivery Information</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Flex alignItems="center" mb={3}>
                                    <Box style={{ position: "relative", top: "-12px", marginRight: "10px" }}>
                                        <Person fontSize="large" color="facebook.500" />
                                    </Box>
                                    <Text fontWeight="bold" fontSize="20px" mr={2}>Name:</Text>
                                    <Text color="facebook.500" fontSize="20px">{delivery.customName}</Text>
                                </Flex>
                                <Flex alignItems="center" mb={3}>
                                    <Box style={{ position: "relative", top: "-12px", marginRight: "10px" }}>
                                        <LocationOn fontSize="large" color="facebook.500" />
                                    </Box>
                                    <Text fontWeight="bold" fontSize="20px" mr={2}>Address:</Text>
                                    <Text color="facebook.500" fontSize="20px">{delivery.deliveryAddress}</Text>
                                </Flex>
                                <Flex alignItems="center" mb={3}>
                                    <Box style={{ position: "relative", top: "-12px", marginRight: "10px" }}>
                                        <Phone fontSize="large" color="facebook.500" />
                                    </Box>
                                    <Text fontWeight="bold" fontSize="20px" mr={2}>Phone:</Text>
                                    <Text color="facebook.500" fontSize="20px">{delivery.phone}</Text>
                                </Flex>
                                <Flex alignItems="center">
                                    <Box style={{ position: "relative", top: "-12px", marginRight: "10px" }}>
                                        <Email fontSize="large" color="facebook.500" />
                                    </Box>
                                    <Text fontWeight="bold" fontSize="20px" mr={2}>Email:</Text>
                                    <Text color="facebook.500" fontSize="20px">{delivery.email}</Text>
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                )}
            </Tr>



            {/* <Box bg='whitesmoke' my={5} p={3} >
                <Box display='flex' justifyContent='space-around' flexDirection={{ base: 'column', sm: 'row' }} >
                    <Text fontSize={20} p={2} fontWeight={400} color='facebook.500' >Order Id : {orderId}</Text>
                    <Text fontSize={20} p={2} fontWeight={400} color='facebook.500' >Status : {orderStatus}</Text>
                    <Text fontSize={20} p={2} fontWeight={400} color='facebook.500' >Order Date : {moment(date).format('DD.MM.YY - hh:mm A')}</Text>
                    {
                        orderStatus === "Order has been delivered."
                            ?
                            <Button onClick={onOpen} my={2} colorScheme='facebook' >Report Order <Error sx={{ ml: 2 }} /></Button>
                            :
                            orderStatus == "Order placed." && <Button onClick={onClickCancel} my={2} colorScheme='facebook' >Cancel Order<Cancel sx={{ ml: 2 }} /></Button>
                    }
                </Box>
                <Divider />
                <SimpleGrid my={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={3} >
                    {
                        products.map((product, index) => {
                            return product !== null && <CollectionCard key={index} collectionId={product} isDelivered={orderStatus === "Order has been delivered."} />
                        })
                    }
                </SimpleGrid>
            </Box>
            <ReportModal onClose={onClose} isOpen={isOpen} orderId={orderId} /> */}
        </>
    )
}

export default OrderCard;