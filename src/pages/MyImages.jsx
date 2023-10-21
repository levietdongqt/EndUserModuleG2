import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Icon, Text, Heading, Button, SimpleGrid } from '@chakra-ui/react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useUserContext } from '../contexts/UserContext';
import { getMyImages } from '../services/ImageServices';
import ShowAlbum from '../components/ShowAlbum';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddCartTemplate from './AddCartTemplate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const MyImages = (props) => {

  const { currentUser } = useUserContext();
  const navigate = useNavigate();
  const [myImages, setMyImages] = useState([]);
  const [myImage, setMyImage] = useState();
  const [openCartDialog, setOpenCartDialog] = useState(false);
  useEffect(() => {
    if (currentUser) {
      getMyImages(currentUser.id)
        .then(result => {
          setMyImages(result.data.result);
        });
    }

  }, []);
  const showAddCart = (myImage) => {
    setMyImage(myImage)
    console.log("Click vo roi", myImage)
    if (myImage.templateId !== 1) {
      setOpenCartDialog(true);
    }
    else {
      navigate("/myimages/noTemplate")
    }
  }
  const handleCloseDialogEdit = () => {
    setOpenCartDialog(false);
  }
  if (currentUser !== "") {
    if (myImages && myImages.length > 0) {
      console.log(myImages)
      return (
        <>
          <Heading textAlign='center' fontSize={30} mt={8}  >MyImages</Heading>
          <Box display={'flex'} justifyContent={'center'}  >

            <Box px={10} py={5} mx={1}>
              <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 4 }} spacing={3} >
                {
                  myImages && myImages.map((myImage) => {
                    const dateTime = myImage.createDate;
                    const indexOfT = dateTime.indexOf('T');
                    return (<>
                      <Box key={myImage.id}>
                        <SimpleGrid columns={{ base: 2, sm: 2, lg: 2, xl: 2 }} spacingX='2px' >
                          <Box>
                            <ShowAlbum images={myImage.images} />
                            <Text textAlign='center' fontSize={20} mt={1} fontWeight={100} >
                              {dateTime.substring(0, indexOfT)}
                              <br></br>
                              {myImage.templateName}
                            </Text>
                          </Box>
                          <Box >
                            <Button
                              rightIcon={<AddPhotoAlternateIcon />} // Sử dụng biểu tượng "Home" ở đây
                              color="Gray41"
                              size="sm"
                              marginBottom={2}
                            >
                            </Button> <br></br>
                            <Button
                              rightIcon={<AddShoppingCartIcon />} // Sử dụng biểu tượng "Home" ở đây
                              colorScheme="red"
                              size="sm"
                              onClick={() => { showAddCart(myImage) }}
                            >
                            </Button>
                          </Box>
                        </SimpleGrid>

                      </Box>
                    </>)
                  })
                }

              </SimpleGrid>
            </Box>
            <AddCartTemplate openDialog={openCartDialog} handleCloseDialog={handleCloseDialogEdit} myImage={myImage} />
          </Box>
        </>
      )
    } else {
      return (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          mt={10}
          p={3}
        >
          <Icon color='#314E89' fontSize={100} as={PhotoLibraryIcon} />
          <Heading textAlign='center' fontSize={30} mt={8}  >You don't have any images</Heading>
          <Button
          leftIcon={<ShoppingCartIcon />} 
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
  } else {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        mt={10}
        p={3}
      >
        <Icon color='#314E89' fontSize={100} as={PhotoLibraryIcon} />
        <Heading textAlign='center' fontSize={30} mt={8}  >You must be logged in</Heading>
        <Text textAlign='center' fontSize={24} mt={2} fontWeight={300} >You must be logged in to see your favorites or buy something.</Text>
        <Button
          // Sử dụng biểu tượng "Home" ở đây
          colorScheme="red"
          size="sm"
          onClick={() => { navigate('/login') }}
        >
          Login Now
        </Button>

      </Box>
    )
  }

}

export default MyImages;