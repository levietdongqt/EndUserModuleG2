import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Icon, Text, Heading, Button, SimpleGrid, Container, List, ListItem, IconButton, Link } from '@chakra-ui/react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useUserContext } from '../contexts/UserContext';
import { getMyImages } from '../services/ImageServices';
import ShowAlbum from '../components/ShowAlbum';
import AddCartTemplate from './AddCartTemplate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BiPhotoAlbum, BiSolidCartAdd } from 'react-icons/bi';
import { deleteMyImage } from '../services/ImageServices';
import swal from 'sweetalert';
import { MdDelete } from "react-icons/md";

const MyImages = (props) => {

  const { currentUser } = useUserContext();
  const navigate = useNavigate();
  const [myImages, setMyImages] = useState([]);
  const [myImage, setMyImage] = useState();
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [isHovered, setIsHovered] = useState([]);
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
    if (myImage.templateId !== 1) {
      setOpenCartDialog(true);
    }
    else {
      navigate("/myimages/noTemplate")
    }
  }
  const handleOpacica = (index, value) => {
    setIsHovered(prev => {
      const newIsHovered = [...prev];
      newIsHovered[index] = value;
      return newIsHovered;
    })
  }
  const handleCloseDialogEdit = () => {
    setOpenCartDialog(false);
  }
  const deleteHandler = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure to delete this item?")) {
      await deleteMyImage(id).then(response => {
        if (response.data.status === 200) {
          getMyImages(currentUser.id)
            .then(result => {
              setMyImages(result.data.result);
            });
          swal({
            title: "Information",
            text: "Delete Successfully!",
            icon: "info",
          })
        }
      })
    }

  }

  if (currentUser !== "") {
    if (myImages && myImages.length > 0) {
      return (
        <>
          <Heading textAlign='center' fontSize={30} mt={8} mb={7} >My Images</Heading>
          <Box display={'flex'} justifyContent={'center'} >
            <Box px={10} py={5} mx={1}>
              <SimpleGrid columns={{ base: 2, sm: 3, lg: 3, xl: 4 }} spacing={7} >
                {
                  myImages && myImages.map((myImage, index) => {
                    const dateTime = myImage.createDate;
                    const indexOfT = dateTime.indexOf('T');
                    return (<>
                      <Box key={index}
                        width={'16.6%'}
                        minWidth={'195px'}
                        mt={2} mb={2}
                        fontSize={16}
                        position={'relative'}

                      >
                        <Box position={'relative'}>
                          <Box position={'relative'}>
                            <Box >
                              <ShowAlbum images={myImage.images} />
                            </Box>
                            <Box position={'relative'}>
                              <Box
                                w={'100%'}
                                position={'absolute'}
                                bottom={'7px'}
                                textAlign={'center'}
                                minHeight={'36px'}

                                opacity={isHovered[index] ? 1 : 0}
                                transition="opacity 0.5s linear"
                                onMouseEnter={() => handleOpacica(index, true)}
                                onMouseLeave={() => handleOpacica(index, false)}
                                boxShadow={isHovered[index] ? '0px 0px 10px rgba(192, 192, 192, 0.5)' : 'none'}
                              >
                                <Box h={'7.0625rem'} w={'12.5rem'}></Box>
                                <List p={0} m={0} backgroundColor={isHovered ? 'rgba(65,70,70,0.5)' : '#414646'}>
                                  <ListItem display={'inline-block'} w={'22%'} height={'30px'} cursor={'pointer'} >
                                    <Link onClick={() => { deleteHandler(myImage.id) }}>
                                      <MdDelete fontSize={30} color={'#fff'} />
                                    </Link>
                                  </ListItem>
                                  <ListItem display={'inline-block'} w={'22%'} height={'30px'} cursor={'pointer'}>
                                    <Link onClick={() => { showAddCart(myImage) }}>
                                      <BiSolidCartAdd fontSize={30} color={'#fff'} />
                                    </Link>
                                  </ListItem>
                                </List>
                              </Box>
                            </Box>
                            <Box padding="0px 0px 0px 5px" margin="10px 0px 0px" lineHeight="20px">
                              <Text textAlign='left' mt={1} mb={'0.3rem'} >
                                {dateTime.substring(0, indexOfT)}
                              </Text>
                              <Text>
                                {myImage.templateName}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
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
        <Container w={'1440px'}>
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
        </Container>
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