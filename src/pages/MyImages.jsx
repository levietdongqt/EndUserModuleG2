import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Icon, Text, Heading, Button, SimpleGrid } from '@chakra-ui/react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useUserContext } from '../contexts/UserContext';
import CollectionCard from '../components/CollectionCard';
import { getMyImages } from '../services/ImageServices';
import ShowAlbum from '../components/ShowAlbum';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CustomImages from './CustomImages';

const MyImages = () => {

  const { currentUser } = useUserContext();
  const navigate = useNavigate();
  const [myImages, setMyImages] = useState([]);
  const [myImage, setMyImage] = useState({});
  const [openCartDialog,setOpenCartDialog] = useState(false);
  useEffect(() => {
    if (currentUser) {
      getMyImages(currentUser.id)
        .then(result => {
          console.log("MyImages", result.data)
          setMyImages(result.data.result);
        });
    }

  }, []);
  const showAddCart = (myImage) => {
    setMyImage(myImage)
    console.log("Click vo roi",myImage)
    setOpenCartDialog(true);
  }
  const handleCloseDialogEdit = () => {
    setOpenCartDialog(false);
  }
  if (currentUser !== "") {
    if (myImages.length !== 0) {
      return (
        <>
          <Heading textAlign='center' fontSize={30} mt={8}  >MyImages</Heading>
          <Box px={10} py={5} mx={1}>
            <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 4 }} spacing={3} >
              {
                myImages.map((myImage) => {
                  const dateTime = myImage.createDate;
                  const indexOfT = dateTime.indexOf('T');
                  return (<>
                    <Box key={myImage.id}>
                      <SimpleGrid columns={{ base: 2, sm: 2, lg: 2, xl: 2 }} spacingX='2px' >
                        <Box>
                          <ShowAlbum images={myImage.images} />
                          <Text textAlign='center' fontSize={20} mt={1} fontWeight={100} >
                            {dateTime}
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
                            onClick={() => {showAddCart(myImage)}}
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
          <CustomImages  openDialog = {openCartDialog} handleCloseDialog={handleCloseDialogEdit} myImage={myImage}/>
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
          variant='solid'
          fontSize={20}
          px={10} mt={10}
          colorScheme='facebook'
          onClick={() => navigate('/login')}>
          Login
        </Button>
        
      </Box>
    )
  }

}

export default MyImages;