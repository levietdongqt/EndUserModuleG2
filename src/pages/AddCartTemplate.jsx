import React, { useEffect, useState } from "react";
import { useUserContext } from '../contexts/UserContext';
import ThemeProvider from '../theme';
import ShowAlbum from "../components/ShowAlbum";
import { getMaterialPage } from "../services/ImageServices";
import {
  Input,
  Paper,
  Button,
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
import { useNavigate } from "react-router-dom";
import { Box, Icon, Text, SimpleGrid, Heading, useToast, Link } from '@chakra-ui/react';
import { addToCart } from "../services/CartService";
import { addToCartAllSimple } from "../services/CartService";

export default function AddCartTemplate({ openDialog, handleCloseDialog, myImage }) {
  const { currentUser } = useUserContext();
  const toast = useToast();
  const navigate = useNavigate();
  const [templateSizeID, setTemplateSizeID] = useState();
  const [materialID, setMaterialID] = useState();
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);
  const [isSimple, setIsSimple] = useState(false);

  const [materialPage, setMaterialPage] = useState([]);
  const popop = (title, messs) => {
    toast({
      title: title,
      description: messs,
      status: title.toLowerCase(),
      duration: 2000,
      isClosable: true,
      position: "top"
    });
  }
  const submit = () => {
    const value = document.getElementById('amount').value;
    if (value > 100 || value < 1) {
      popop("Warning", 'Amount must be from 1 to 100 !')
      return;
    }
    setAmount(value);
    if (!templateSizeID) {
      popop("Warning", 'Prints size is require !')
      return;
    }
    if (!materialID) {
      popop("Warning", 'Material page is require !')
      return;
    }
    var formData = new FormData();
    formData.append("userID", currentUser.id)
    formData.append("myImageID", myImage.id)
    formData.append("templateId", myImage.templateId)
    formData.append("materialPageId", materialID)
    formData.append("temlateSizeId", templateSizeID)
    formData.append("quantity", amount)
    var area = myImage.printSizes.reduce((acc, obj) => {
      if (obj.templateSizeID === templateSizeID) {
        return obj.width * obj.length;
      }
      return acc;
    }, 0);
    formData.append("imageArea", area)
    if(myImage.templateId === 1){
      addToCartAllSimple(formData).then(response => {
        if (response.data.status === 200) {
          toast({
            title: 'Infomation',
            description: 'All images add to cart successfully !',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: "top"
          });
        } else {
          popop("Error", 'Add to cart fail, please reload and try again !')
        }
      })
      return;
    }
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
        popop("Error", 'Add to cart fail, please reload and try again !')
      }
    })
  }
  useEffect(() => {
    if (materialID && templateSizeID && amount) {
      var area = myImage.printSizes.reduce((acc, obj) => {
        if (obj.templateSizeID === templateSizeID) {
          return obj.width * obj.length;
        }
        return acc;
      }, 0);
      var pricePerInch = materialPage.reduce((acc, obj) => {
        if (obj.id === materialID) {
          return obj.pricePerInch
        }
        return acc;
      }, 0)
      var pricee = pricePerInch * area * amount + myImage.pricePlusPerOne;
      console.log("Gia ne",myImage.pricePlusPerOne)
      setPrice(pricee.toFixed(2))
    }
  }, [amount, materialID, templateSizeID])
  useEffect(() => {
    console.log("Day ne", myImage)
    setPrice(0)
    if (myImage) {
      if(myImage.templateId === 1) {
        setIsSimple(true)
      }
      getMaterialPage().then(response => {
        if (response.data.status === 200) {
          setMaterialPage(response.data.result)
        }
      })
    }

  }, [myImage])
  const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    margin: '20px',
  });
  if (myImage && myImage.printSizes) {
    return (
      <>
        <ThemeProvider>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="lg"
            PaperProps={{
              style: {
                backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
                width: 900, // thay đổi độ rộng cố định theo ý muốn của bạn
                height: 900, // thay đổi chiều dài cố định theo ý muốn của bạn
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
              Custom Product
            </DialogTitle>
            <CustomDialogContent>
              <Box px={10} py={5} mx={1}>
                {
                  <SimpleGrid columns={{ base: 1, sm: 1, lg: 1, xl: 1 }} spacing={3} >
                    <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 3 }} spacing={3} >
                      <Box>
                        <ShowAlbum images={myImage.images} isCart={false} />
                        <Text textAlign='center' fontSize={20} mt={1} fontWeight={100} >
                          {myImage.templateName}
                        </Text>
                      </Box>
                      <Box></Box>
                      <Box >
                        <Text textAlign='left' fontSize={28} mt={0} fontWeight={600} color='facebook.500' >Product Details</Text>
                        <Text textAlign='left' mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Amount: {amount}</Text>
                        <Text textAlign='left' mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Total Price: {price} $</Text>
                      </Box>
                    </SimpleGrid>
                    {
                      isSimple &&
                      <Link textDecoration={'underline'} cursor={'pointer'} _hover={{ color: 'blue' }} textAlign={'right'} onClick={() => {
                        navigate("/myimages/noTemplate")
                      }}>Add to cart with each image</Link>
                    }
                    <hr></hr>
                    <Box>
                      <SimpleGrid columns={{ base: 1, sm: 1, lg: 1, xl: 1 }} spacing={3} >
                        <FormControl>
                          <InputLabel
                            sx={{
                              fontSize: '20px', // Điều chỉnh cỡ chữ
                              fontWeight: 'bold' // Điều chỉnh độ đậm
                            }}
                          >Prints Size</InputLabel>
                          <Select
                            value={templateSizeID}
                            onChange={(event) => { setTemplateSizeID(event.target.value) }}
                            required={true}
                          >
                            {myImage && myImage.printSizes.map((option, index) => (
                              <MenuItem key={index} value={option.templateSizeID}>
                                {option.width} X {option.length}
                              </MenuItem>
                            ))}
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
                            value={materialID}
                            onChange={(event) => { setMaterialID(event.target.value) }}
                            required={true}
                          >
                            {materialPage && materialPage.map((option, index) => (
                              <MenuItem key={index} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <TextField
                            value={amount}
                            id="amount"
                            label="Amount"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={event => setAmount(event.target.value)}

                          />
                        </FormControl>

                      </SimpleGrid>
                    </Box>
                  </SimpleGrid>
                }

              </Box>
            </CustomDialogContent>

            <DialogActions>
              <Button
                component="label"
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                color="primary"
                sx={
                  {
                    // ... các style khác
                  }
                }
                onClick={submit}
              >
                Add to Cart
              </Button>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>

      </>


    );
  }

}
