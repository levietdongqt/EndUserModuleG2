import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Container, SimpleGrid, Image, CircularProgress,Heading,Link,Flex,Grid,GridItem } from '@chakra-ui/react';
import { AccountBalanceWallet, AssignmentReturn, WorkspacePremium } from '@mui/icons-material';
import {DefaultPlayer as Video} from 'react-html5video';
import Carousel from '../components/Carousel';
import { getAllCategories } from '../services/CategoryServices';
import { useSearchContext } from '../contexts/SearchContext';
import {getAllTemplate, getTemplateBestller} from "../services/TemplateServices";
import {getAllCollection } from '../services/CollectionServices';
import Slider from "react-slick";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: true,

};
const Home = () => {

  const navigate = useNavigate();
  const { setSearch } = useSearchContext();
  const [categories, setCategory] = useState([]);
  const [collections, setCollection] = useState([]);
  const [best, setBest] = useState([]);
  useEffect(() => {
    Promise.all([
      getAllCategories(),
      getAllCollection(),
      getTemplateBestller()
    ])
        .then(([categoriesResult, collectionResult, bestResult]) => {
          setCategory(categoriesResult.result);
          setCollection(collectionResult.result);
          setBest(bestResult.result);
        });
  }, []);

  const onClickImage = () => {
    setSearch('a');
    navigate('/search');
  }
  const desiredCollections = ['Book 1', 'Gift 1', 'Calendar 2', 'Card 2'];
  return (
      <>
        <Container maxW='1140px' mx="auto">
          <Box display='flex' justifyContent='center' >
            <Carousel />
          </Box>
          <Box mt={4} mb={3}>
            <Box>
              <Heading as='h3' size='lg' display={'inline'}>Featured Products</Heading>
              <Link float="right" textColor={'facebook.500'} display={'inline-block'} lineHeight={'36px'} textDecoration={'auto'}>Shop all product</Link>
            </Box>
            <Box  mt={7}>
              <SimpleGrid columns={[3, null, 4]} spacing='35px'>
                {
                    best && best.map((bested) =>
                        (
                         <Box key={bested.id}>
                          <Slider {...settings} style={{ width: '250px', margin: '0 auto',height: '250px' }}>
                            {bested.templateImages && bested.templateImages.map((item,index) => (
                                <div key={index} style={{height: '100%', width: '100%'}}>
                                  <Image
                                      key={item && item.id ? item.id : ''}
                                      style={{ height: '250px', width: '250px' }}
                                      objectFit='cover'
                                      maxW={'100%'}
                                      cursor='pointer'
                                      src={item && item.imageUrl ? `${process.env.REACT_APP_API_BASE_URL_LOCAL}${item.imageUrl}` : ''}
                                      onClick={() =>
                                          navigate(`/template/${bested.name}`, {
                                            state: {productId: bested.id},
                                          })
                                      }
                                  />
                                </div>
                            ))}
                          </Slider>
                          <Box>
                            <Box mt={3}>
                              <Link color={'#284b9b'} onClick={() =>
                                  navigate(`/template/${bested.name}`, {
                                    state: {productId: bested.id},
                                  })
                              } > {bested.name} ></Link>
                            </Box>
                          </Box>
                        </Box>
                        )
                    )
                }
              </SimpleGrid>
            </Box>
          </Box>
          <Box mt={7} mb={3}>
            <Box>
              <Heading as='h3' size='lg' display={'inline'}>Featured Collections</Heading>
            </Box>
            <Box mt={7}>
              <SimpleGrid columns={2} spacing={10}>
                {
                    collections &&
                    desiredCollections.map((collectionName, index) => {
                      const collection = collections.find((cat) => cat.name === collectionName);
                      if (collection) {
                        return (
                            <Box key={collection.name}>
                              <Image w={570} h={270} maxW={'100%'} cursor={'pointer'} onClick={() =>
                                  navigate(`/search/${collection.name}`, {
                                    state: {collectionsId: collection.id},
                                  })
                              } src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${collection.imageUrl}`} />
                              <Box mt={3}>
                                <Link color={'#284b9b'} onClick={() =>
                                    navigate(`/search/${collection.name}`, {
                                      state: {collectionsId: collection.id},
                                    })
                                } > {collection.name} ></Link>
                              </Box>
                            </Box>
                        );
                      }
                      return null;
                    })
                }
              </SimpleGrid>
            </Box>
          </Box>

        </Container>
        <Box bg='#323264' mt={10} >
          <Container maxWidth={1200} display='flex' justifyContent='space-between' alignItems='center' flexDirection={{ base: 'column', md: 'row' }} py={7}>
            <Box color='#fff' alignItems='center' display='flex' flexDirection='column' >
              <AccountBalanceWallet sx={{ fontSize: 50 }} color='inherit' />
              <Text mt={3} fontSize={20} fontWeight={600} color='inherit' >Secure Payment Options</Text>
            </Box>
            <Box color='#fff' alignItems='center' display='flex' flexDirection='column' mt={{ base: 5, md: 0 }} >
              <AssignmentReturn sx={{ fontSize: 50 }} color='inherit' />
              <Text mt={3} fontSize={20} fontWeight={600} color='inherit' >30 Days Free Returns</Text>
            </Box>
            <Box color='#fff' alignItems='center' display='flex' flexDirection='column' mt={{ base: 5, md: 0 }} >
              <WorkspacePremium sx={{ fontSize: 50 }} color='inherit' />
              <Text mt={3} fontSize={20} fontWeight={600} color='inherit' >Clothify Quality Assurance</Text>
            </Box>
          </Container>
        </Box>
        {/*{fadeImages.length === 0 && (
                <>
                  <Box my={20} display='flex' justifyContent='center' width='100%'>
                    <CircularProgress isIndeterminate color='facebook.500' />
                  </Box>
                  <Box my={20} display='flex' justifyContent='center' width='100%'>
                    <CircularProgress isIndeterminate color='facebook.500' />
                  </Box>
                </>
            )}*/}
      </>
  )
}

export default Home;