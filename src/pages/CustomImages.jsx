import React, { useEffect, useState, useRef } from "react";
import ImageUploading from "react-images-uploading";
import { useUserContext } from '../contexts/UserContext';
import { uploadImages } from "../services/ImageServices";
import ThemeProvider from '../theme';
import ShowAlbum from "../components/ShowAlbum";
import { getMaterialPage } from "../services/ImageServices";
import {
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
import { Box, Icon, Text, SimpleGrid, Heading, useToast } from '@chakra-ui/react';

export default function CustomImages({ openDialog, handleCloseDialog, myImage }) {
  const [images, setImages] = useState([]);
  const { currentUser } = useUserContext();
  const maxNumber = 15;
  const dateTime = myImage.createDate;
  const indexOfT = dateTime.indexOf('T');
  const toast = useToast();
  const [templateID, setTemplateID] = useState(myImage.printSizes[0].templateId);
  const [materialID, setMaterialID] = useState(myImage.printSizes[0].templateId);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);
  const [materialPage, setMaterialPage] = useState([]);
  const handleSelectChange = (event) => {
    setTemplateID(event.target.value);
  };
  const handleSelectChange2 = (event) => {
    setMaterialID(event.target.value);
  };
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  console.log("Day ne",myImage)
  useEffect(() => {
      getMaterialPage().then(response => {
        console.log("Material: ", response.data)
        if(response.data.status === 200) {
          
          setMaterialPage(response.data.result)
        }
      })
  },[])
  const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    margin: '20px',
  });
  return (
    <>
      <ThemeProvider>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          PaperProps={{
            style: {
              backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
              width: 1000, // thay đổi độ rộng cố định theo ý muốn của bạn
              height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
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
                myImage.templateId === 1 ?
                  <>
                    <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 4 }} spacing={3} >
                      <Box>
                        <ShowAlbum images={myImage.images} />
                        <Text textAlign='center' fontSize={20} mt={1} fontWeight={100} >
                          {dateTime.substring(0, indexOfT)}
                          <br></br>
                          {myImage.templateName}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </>
                  :
                  <>
                    <SimpleGrid columns={{ base: 1, sm: 1, lg: 1, xl: 1 }} spacing={3} >
                      <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 3 }} spacing={3} >
                        <Box>
                          <ShowAlbum images={myImage.images} />
                          <Text textAlign='center' fontSize={20} mt={1} fontWeight={100} >
                            {dateTime.substring(0, indexOfT)}
                            <br></br>
                            {myImage.templateName}
                          </Text>
                        </Box>
                        <Box></Box>
                        <Box >
                          <Text textAlign='left' fontSize={28} mt={10} fontWeight={600} color='facebook.500' >Product Details</Text>
                          <Text textAlign='left' mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Amount: {amount}</Text>
                          <Text textAlign='left'  mt={3} fontSize={24} color='facebook.500' fontWeight={300} >Total Price: {price} $</Text>
                        </Box>
                      </SimpleGrid>
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
                              value={templateID}
                              onChange={handleSelectChange}
                              required={true}
                            >
                              {myImage.printSizes.map((option, index) => (
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
                              onChange={handleSelectChange2}
                              required={true}
                            >
                              {materialPage && materialPage.map((option, index) => (
                                <MenuItem key={index} value={option.id}>
                                 {option.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </SimpleGrid>
                      </Box>
                    </SimpleGrid>
                  </>
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
