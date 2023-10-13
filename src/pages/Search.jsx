import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Box, SimpleGrid, Button, Select, Text, Icon, Heading, Container} from '@chakra-ui/react';

import TemplateCard from '../components/templateCard';
import FilterMenu from '../components/FilterMenu';
import {getTemplateByCollection } from '../services/CollectionServices';
import { useSearchContext } from '../contexts/SearchContext';
import { SearchOff } from '@mui/icons-material';

const Search = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { search, canSearch } = useSearchContext();
  const [openFilter, setOpenFilter] = useState(true);
  const [template, setTemplates] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    if (state !== null) {
      getTemplateByCollection(state.collectionsId)
        .then((result) => {
          setTemplates(result.result);
          console.log("Hello",result.result);
        });
      setSortBy("recommended");
    }
   /* if (search !== "" && search !== " " && search !== null && search !== undefined && canSearch) {
      getProductBySearch(search)
        .then((result) => {
          setTemplates(result.products);
        });
      setSortBy("recommended");
    }*/
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
    setTemplates(template.sort((a, b) => (a.price - b.price)));
  };

  const sortByPriceDesc = () => {
    setTemplates(template.sort((a, b) => (b.price - a.price)));
  };

  return (
      <Container maxW='1140px'>
        <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3} backgroundColor='whitesmoke' >
          <Box textAlign={'center'} mb={3}>
            <Heading as='h2' size='3xl' >{template.name}</Heading>
          </Box>
          <Box
              width='100%'
              height='auto'
              display='flex'
              justifyContent={'space-between'}
              py={5} >
            <FilterMenu  openFilter={openFilter} columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} setProducts={template} setSortBy={setSortBy} />
            <Select colorScheme='facebook' onChange={handleChange} value={sortBy} backgroundColor='#fff' width='170px' >
              <option value='recommended'>Best Sellers</option>
              <option value='lowest'>Lowest Price</option>
              <option value='highest'>Highest Price</option>
            </Select>
          </Box>
          <SimpleGrid minChildWidth={280} gap={3} spacingX={5} >
            {
                template.templateNames && template.templateNames.map((items, index) =>{
                  return <TemplateCard key={index} collectionId={items.id} />
                })
            }
            {
                template.length === 0 &&
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
                    <Heading textAlign='center' fontSize={30} mt={8}  >Sorry, we couldn't find what you are looking for.</Heading>
                    <Text textAlign='center' fontSize={24} mt={2} fontWeight={300} >But don’t give up! Check out our bestsellers and find something for you!</Text>
                    <Button
                        variant='solid'
                        fontSize={20}
                        px={10} mt={10}
                        colorScheme='facebook'
                        onClick={() => navigate('/')}>
                      Start Shopping
                    </Button>
                  </Box>
                </Box>
            }
          </SimpleGrid>
        </Box>
      </Container>
  )
}

export default Search;