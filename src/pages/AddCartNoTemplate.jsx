import React, {useEffect, useState} from "react";
import {useUserContext} from "../contexts/UserContext";
import {getNoTemplate} from "../services/ImageServices";
import {getMaterialPage} from "../services/ImageServices";
import {
    Box, Icon, Text, Heading, SimpleGrid, Button, Image, useToast,Container,
} from '@chakra-ui/react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ThemeProvider from '../theme';
import {useNavigate} from 'react-router-dom';
import {
    Input,
    Paper,
    Typography,
    TextField,
    Grid,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,

} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {addToCart} from "../services/CartService";

const AddCartNoTemplate = () => {
    const {currentUser} = useUserContext()
    const [materialPage, setMaterialPage] = useState([]);
    const [templateSizeID, setTemplateSizeID] = useState([]); // Set default value to an empty array or any other appropriate default value
    const [materialID, setMaterialID] = useState([]); // Set default value to an empty array or any other appropriate default value
    const [amount, setAmount] = useState([]); // Set default value to an empty array or any other appropriate default value
    const [price, setPrice] = useState([]); // Set default value to an empty array or any other appropriate default value
    const navigate = useNavigate();
    const toast = useToast();
    const [myImage, setMyImage] = useState();
    useEffect(() => {
        if (currentUser) {
            getNoTemplate(currentUser.id).then(response => {
                console.log(response)
                if (response.data.status === 200) {
                    setMyImage(response.data.result)
                    getMaterialPage().then(response => {
                        if (response.data.status === 200) {
                            console.log("Page", response.data.result)
                            setMaterialPage(response.data.result)
                        }
                    })

                } else {
                    setMyImage({});
                }
            })
        }
    }, [])
    useEffect(() => {
        var newPrice = [...price];
        newPrice = amount.map((item, index) => {
            if (templateSizeID[index] && amount[index] && materialID[index]) {
                console.log("Result", templateSizeID, amount, materialID)
                var area = myImage[index].printSizes.reduce((acc, obj) => {
                    if (obj.templateSizeID === templateSizeID[index]) {
                        return obj.width * obj.length;
                    }
                    return acc;
                }, 0);
                var pricePerInch = materialPage.reduce((acc, obj) => {
                    if (obj.id === materialID[index]) {
                        return obj.pricePerInch
                    }
                    return acc;
                }, 0)
                var pricee = pricePerInch * area * amount[index];

                return pricee.toFixed(2);
            }
            return 0;
        })
        setPrice(newPrice);
    }, [amount, materialID, templateSizeID])
    const handlePrintSize = (value, index) => {
        const newTemplateSizeID = [...templateSizeID];
        newTemplateSizeID[index] = parseInt(value); // Chuyển đổi giá trị nhập thành số nguyên
        setTemplateSizeID(newTemplateSizeID);
    };
    const handleAmount = (value, index) => {
        console.log("Currenr", amount)
        const newAmount = [...amount];
        newAmount[index] = parseInt(value);
        console.log(newAmount)
        setAmount(newAmount);
        console.log("Last", amount)
    };
    const handleMaterialPage = (value, index) => {
        const newMaterialID = [...materialID];
        newMaterialID[index] = parseInt(value); // Chuyển đổi giá trị nhập thành số nguyên
        setMaterialID(newMaterialID);
    };
    const hanldePrice = (index) => {
        if (templateSizeID[index] && amount[index] && materialID[index]) {

            console.log("Result", templateSizeID, amount, materialID)
            var area = myImage[index].printSizes.reduce((acc, obj) => {
                if (obj.templateSizeID === templateSizeID[index]) {
                    return obj.width * obj.length;
                }
                return acc;
            }, 0);
            var pricePerInch = materialPage.reduce((acc, obj) => {
                if (obj.id === materialID[index]) {
                    return obj.pricePerInch
                }
                return acc;
            }, 0)
            var pricee = pricePerInch * area * amount[index];
            const newPrice = [...price]
            newPrice[index] = pricee.toFixed(2);
            setPrice(newPrice);
        }
    }
    const submit = (index) => {
        if (amount[index] > 100 || amount[index] < 1) {
            toast({
                title: 'Warning',
                description: 'Amount must be from 1 to 100 !',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        if (!templateSizeID[index]) {
            toast({
                title: 'Warning',
                description: 'Prints size is require !',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        if (!materialID[index]) {
            toast({
                title: 'Warning',
                description: 'Material page is require !',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        var formData = new FormData();
        formData.append("userID", currentUser.id)
        formData.append("myImageID", myImage[index].id)
        formData.append("templateId", myImage[index].templateId)
        formData.append("materialPageId", materialID[index])
        formData.append("temlateSizeId", templateSizeID[index])
        formData.append("quantity", amount[index])
        var area = myImage[index].printSizes.reduce((acc, obj) => {
            if (obj.templateSizeID === templateSizeID[index]) {
                return obj.width * obj.length;
            }
            return acc;
        }, 0);
        formData.append("imageArea", area)
        addToCart(formData).then(response => {
            if (response.data.status === 200) {
                toast({
                    title: 'Infomation',
                    description: 'A item just add to cart successfully !',
                    status: 'info',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Add to cart fail, please reload and try again !',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            }
        })
    }
    if (myImage) {
        return (
            <>
            <Container maxW='71.25rem'>
                    <Heading textAlign='center' fontSize={40} mt={8}>Simple Prints</Heading>
                    {

                        myImage.map((item, index) => {
                            return (

                                <ThemeProvider>
                                    <Box
                                        display='flex'
                                        justifyContent='left'
                                        alignItems='left'
                                        flexDirection='column'
                                        mt={10}
                                        p={3}>
                                        <SimpleGrid columns={{base: 3, sm: 1, lg: 2, xl: 3}} spacing={3}>
                                            <Image
                                                key={`${index}`}
                                                style={{height: '200px', width: '300px'}}
                                                objectFit={'cover'}
                                                src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${item.images[0].imageUrl}`}
                                            />
                                            <Box>
                                                <SimpleGrid columns={{base: 1, sm: 1, lg: 1, xl: 1}} spacing={3}>
                                                    <FormControl>
                                                        <InputLabel
                                                            sx={{
                                                                fontSize: '20px', // Điều chỉnh cỡ chữ
                                                                fontWeight: 'bold' // Điều chỉnh độ đậm
                                                            }}
                                                        >Prints Size</InputLabel>
                                                        <Select
                                                            value={templateSizeID[index]}
                                                            onChange={(event) => {
                                                                handlePrintSize(event.target.value, index)
                                                            }}
                                                            required={true}
                                                        >
                                                            {item && item.printSizes.map((option, index2) => {
                                                                return (
                                                                    <MenuItem key={index2}
                                                                              value={option.templateSizeID}>
                                                                        {option.width} X {option.length}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl>
                                                        <InputLabel
                                                            sx={{
                                                                fontSize: '20px', // Điều chỉnh cỡ chữ
                                                                fontWeight: 'bold' // Điều chỉnh độ đậm
                                                            }}
                                                        >Material Page</InputLabel>
                                                        <Select
                                                            required={true}
                                                            onChange={(event) => {
                                                                handleMaterialPage(event.target.value, index)
                                                            }}
                                                        >
                                                            {materialPage && materialPage.map((option, index2) => (
                                                                <MenuItem key={index2} value={option.id}>
                                                                    {option.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl>
                                                        <TextField
                                                            value={amount[index]}
                                                            id="amount"
                                                            label="Amount"
                                                            type="number"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onChange={event => handleAmount(event.target.value, index)}
                                                        />
                                                    </FormControl>
                                                </SimpleGrid>
                                            </Box>
                                            <Box ml={20}>
                                                <SimpleGrid columns={{base: 1, sm: 1, lg: 1, xl: 1}} spacing={3}>
                                                    <Text textAlign='left' mt={1} fontSize={24} color='facebook.500' fontWeight={700}>Amount: {amount[index]}</Text>
                                                    <Text textAlign='left' mt={1} fontSize={24} color='facebook.500' fontWeight={700}>Price: ${price[index]}</Text>
                                                    <Button
                                                        variant='solid'
                                                        leftIcon={<AddShoppingCartIcon/>}
                                                        fontSize={20}
                                                        px={6}
                                                        py={3}
                                                        mt={0}
                                                        color='facebook'
                                                        bg='blue.500'
                                                        borderRadius={10}
                                                        transition='background-color 0.3s'
                                                        _hover={{
                                                            bg: 'blue.600',
                                                        }}
                                                        onClick={() => {
                                                            submit(index)
                                                        }}
                                                    >
                                                        Add To Cart
                                                    </Button>
                                                </SimpleGrid>

                                                {/* <Button
                        component="label"
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        color="primary"
                        sx={
                          {
                            // ... các style khác
                          }
                        }
                      >
                        Add to Cart
                      </Button> */}
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                </ThemeProvider>

                            )
                        })

                    }

            </Container>
            </>
        )
    } else {
        return (<>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                mt={10}
                p={3}
            >
                <Icon color='#314E89' fontSize={100} as={PhotoLibraryIcon}/>
                <Heading textAlign='center' fontSize={30} mt={8}>You don't have any images</Heading>
                <Button
                    variant='solid'
                    leftIcon={<ShoppingCartIcon/>}
                    fontSize={20}
                    px={0} mt={0}
                    color='facebook'
                    onClick={() => navigate('/')}>
                    Add To Cart
                </Button>
            </Box>
        </>)
    }

}
export default AddCartNoTemplate;