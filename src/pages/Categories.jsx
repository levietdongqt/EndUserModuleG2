import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Button, Text, Icon, Heading,Container,Image } from '@chakra-ui/react';
import CollectionCard from '../components/CollectionCard';
import {getCategoryById}  from "../services/CategoryServices";
import { useSearchContext } from '../contexts/SearchContext';
import { SearchOff } from '@mui/icons-material';

const Categories = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { search, canSearch } = useSearchContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (state !== null) {
      getCategoryById(state.categoryId)
        .then((result) => {
          setProducts(result.result);
        });
    }
  }, [state, search, canSearch]);

  return (
      <Container maxW='1140px'>
        <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3} backgroundColor='whitesmoke' >
          <Box textAlign={'center'} mb={3}>
            <Heading as='h2' size='3xl' >{products.length > 0 ? products.name : ''}</Heading>
          </Box>
          <Box key={products.id} mt={10}>
            <Image  maxW={'100%'} height={350} src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${products.imageUrl}`}/>
          </Box>
          <Box
              width='100%'
              height='auto'
              py={5}
              display={'flex'}
              justifyContent={'right'}
          >
          </Box>
          <Heading textAlign={'center'} mb={10} mt={5}>
            Cover options to start your page-turner
          </Heading>
          <Box display='flex' flexDirection={{ base: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
            <div style={{ display: 'inline-block', flex: '3' }}>
              <SimpleGrid columns={[1, 1, 1, 3]} spacing='40px' gap={10}>
                {
                    products.collections && products.collections.map((item) => {
                    return (
                        <div key={item.id}>
                          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', alignItems: 'center' }}>
                            <CollectionCard collectionId={item.id} />
                          </div>
                        </div>
                    )
                  })
                }
                {products.length === 0 && (
                    <Box display='flex' justifyContent='start'>
                      <Box
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                          flexDirection='column'
                          mt={10}
                          p={3}
                      >
                        <Icon color='#314E89' fontSize={100} as={SearchOff} />
                        <Heading textAlign='center' fontSize={30} mt={8}>
                          Sorry, we couldn't find what you were looking for.
                        </Heading>
                        <Text textAlign='center' fontSize={24} mt={2} fontWeight={300}>
                          But never give up! Check out our best-selling products and find what's right for you!
                        </Text>
                        <Button
                            variant='solid'
                            fontSize={20}
                            px={10}
                            mt={10}
                            colorScheme='facebook'
                            onClick={() => navigate('/')}
                        >
                          Start shopping
                        </Button>
                      </Box>
                    </Box>
                )}
              </SimpleGrid>
            </div>
          </Box>

        </Box>
      </Container>
  )
}

export default Categories;