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
const Home = () => {

  const navigate = useNavigate();
  const { setSearch } = useSearchContext();
  const [categories, setCategory] = useState([]);
  const [collections, setCollection] = useState([]);
  const [best, setBest] = useState([]);
  useEffect(() => {
    getAllCategories()
        .then((result) => {
          setCategory(result.result);
        });
    getAllCollection()
        .then((result) => {
          setCollection(result.result)
        });
    getTemplateBestller()
        .then((result) => {
            setBest(result.result);
        });
  }, []);

  const onClickImage = () => {
    setSearch('a');
    navigate('/search');
  }
  const desiredCollections = ['Book 1', 'Gift 1', 'Calendar 2', 'Card 2'];
  return (
      <>
        <Container maxW='1200px'>
          <Box display='flex' justifyContent='center' >
            <Carousel />
          </Box>
          <Box mt={4} mb={3}>
            <Box>
              <Heading as='h3' size='lg' display={'inline'}>Featured Products</Heading>
              <Link float="right" textColor={'facebook.500'} display={'inline-block'} lineHeight={'36px'} textDecoration={'auto'}>Shop all product</Link>
            </Box>
            <Box mt={7}>
              <SimpleGrid columns={[3, null, 4]} spacing='35px'>
                {
                    best && best.map((bested) => {
                      if(bested.status == true){
                        return (
                            <Box key={bested.id}>
                              <Box>
                                {
                                  bested.templateImages.map((item) =>{
                                    return <Image w={260} h={260} maxW={'100%'} src={item.imageUrl} key={item.id} />
                                  })
                                }
                                <Box mt={3}>
                                  <Link color={'#284b9b'} > {bested.name} ></Link>
                                </Box>
                              </Box>
                            </Box>
                        )
                      }
                    })
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
                              <Image w={570} h={270} maxW={'100%'} src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${collection.imageUrl}`} />
                              <Box mt={3}>
                                <Link color={'#284b9b'} > {collection.name} ></Link>
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