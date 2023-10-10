import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Button, Select, Text, Icon, Heading,Container,Image } from '@chakra-ui/react';

import ClothesCard from '../components/ClothesCard';
import FilterMenu from '../components/FilterMenu';
import {  getProductBySearch } from '../services/ProductServices';
import {getCategoryById}  from "../services/CategoryServices";
import { useSearchContext } from '../contexts/SearchContext';
import { SearchOff } from '@mui/icons-material';

const Search = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { search, canSearch } = useSearchContext();
  const [openFilter, setOpenFilter] = useState(true);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    if (state !== null) {
      getCategoryById(state.categoryId)
        .then((result) => {
          setProducts(result.result);
        });
      setSortBy("recommended");
    }
    if (search !== "" && search !== " " && search !== null && search !== undefined && canSearch) {
      getProductBySearch(search)
        .then((result) => {
          setProducts(result.products);
        });
      setSortBy("recommended");
    }
  }, [state, search, canSearch]);

  const handleChange = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === "lowest") {
      sortByPriceAsc();
    } else if (e.target.value === "highest") {
      sortByPriceDesc();
    }
  };

  const sortByPriceAsc = () => {
    setProducts(products.sort((a, b) => (a.price - b.price)));
  };

  const sortByPriceDesc = () => {
    setProducts(products.sort((a, b) => (b.price - a.price)));
  };

  return (
      <Container maxW='1200px'>
        <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3} backgroundColor='whitesmoke' >
          <Box textAlign={'center'} mb={3}>
            <Heading as='h2' size='3xl' >{products.length > 0 ? products[0].name : ''}</Heading>
          </Box>
          <Box key={products.id} mt={10}>
            <Image  maxW={'100%'} height={350} src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${products[0]?.imageUrl}`}/>
          </Box>
          <Box
              width='100%'
              height='auto'
              py={5}
              display={'flex'}
              justifyContent={'right'}
          >
            <Select colorScheme='facebook' onChange={handleChange} value={sortBy} backgroundColor='#fff' width='170px'>
              <option value='recommended'>Best Sellers</option>
              <option value='lowest'>Lowest Price</option>
              <option value='highest'>Highest Price</option>
            </Select>
          </Box>
          <Box display='flex' flexDirection={{ base: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' }}>
            <div style={{ display: 'inline-block', flex: '1' }}>
              <Heading as='h4' size='md'>Shop by</Heading>
              <FilterMenu openFilter={openFilter} columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} setProducts={setProducts} setSortBy={setSortBy} />
            </div>
            <div style={{ display: 'inline-block', flex: '3' }}>
              <SimpleGrid minChildWidth='200px' spacing='40px' gap={16}>
                {products &&
                    products.map((product) => {
                      return (
                          <div key={product.id}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                              {product.collections.map((collection) => {
                                if (collection.templateDTO.length > 0) {
                                  return (
                                      <div key={collection.id} style={{ display: 'flex', flexDirection: 'column', marginRight: '16px' }}>
                                        <Heading as='h2' size='lg' style={{ marginBottom: '8px' }}>
                                          {collection.name}
                                        </Heading>
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                          {collection.templateDTO.map((template) => {
                                            return (
                                                <div key={template.id} style={{ flex: '1', margin: '8px' }}>
                                                  <ClothesCard key={template.name} templateId={template.id} />
                                                </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                      );
                    })}
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
                          Xin lỗi, chúng tôi không thể tìm thấy điều bạn đang tìm kiếm.
                        </Heading>
                        <Text textAlign='center' fontSize={24} mt={2} fontWeight={300}>
                          Nhưng đừng bao giờ từ bỏ! Hãy xem các sản phẩm bán chạy nhất của chúng tôi và tìm sản phẩm phù hợp với bạn!
                        </Text>
                        <Button
                            variant='solid'
                            fontSize={20}
                            px={10}
                            mt={10}
                            colorScheme='facebook'
                            onClick={() => navigate('/')}
                        >
                          Bắt đầu mua sắm
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

export default Search;