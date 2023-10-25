import xReact, { useEffect, useState } from 'react';
import { useLocation, useNavigate,useParams  } from 'react-router-dom';
import {Box, SimpleGrid, Button, Select, Text, Icon, Heading, Container} from '@chakra-ui/react';
import queryString from 'query-string';
import TemplateCard from '../components/templateCard';
import FilterMenu from '../components/FilterMenu';
import {getTemplateByCollection } from '../services/CollectionServices';
import { SearchOff } from '@mui/icons-material';
import Pagination  from '../components/Pagination';
const Collections = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const [template, setTemplates] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState([]);
  const { name } = useParams();
  const [pagination, setPagination] = useState({
      page: 1,
      limit: 20,
      totalRows: 1,
  });
  const [filters , setFilters] = useState({
    limit: 20,
    page: 1,
  })
  useEffect(() => {
    if (state !== null) {
      if (isNaN(filters.page)) {
        // If the page is not a valid number, set it to 1
        setFilters({
          ...filters,
          page: 1,
        });
        return;
      }
       const paramsString = queryString.stringify(filters);
      getTemplateByCollection(state.collectionsId,paramsString)
        .then((result) => {
          setShow(result.result.items);
          setPagination({
            totalRows: result.result.totalRows,
            limit: result.result.limit,
          });
          result.result.items.forEach((item) => {
            setTemplates(item.templateNames);
            setTotal(item.templateNames.length);
          });
        });
      setSortBy("recommended");
    }
  }, [state,filters]);

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  }

  const handleChange = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === "lowest") {
      sortByPriceAsc();
    } else if (e.target.value === "highest") {
      sortByPriceDesc();
    }
  };

  const sortByPriceAsc = () => {
    setTemplates(template.sort((a, b) => (a.pricePlusPerOne - b.pricePlusPerOne)));
  };

  const sortByPriceDesc = () => {
    setTemplates(template.sort((a, b) => (b.pricePlusPerOne - a.pricePlusPerOne)));
  };

  return (
      <Container maxW='1140px'>
        <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3} >
        <Box textAlign={'center'} mb={3}>
          <Heading as='h2' size='3xl'>
            {name}
          </Heading>
          </Box>
          <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              py={5}
          >
            <FilterMenu
                columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
                setProducts={template}
                setSortBy={setSortBy}
            />
            <Box display={'flex'} m={3} alignItems={'center'}>
              <Text fontSize={16} fontWeight={500} mb={0} float={'right'}>&nbsp;{total} Results</Text>
              <Select colorScheme='facebook' onChange={handleChange} value={sortBy} backgroundColor='#fff' width='170px'>
                <option value='recommended'>Best Sellers</option>
                <option value='lowest'>Lowest Price</option>
                <option value='highest'>Highest Price</option>
              </Select>
            </Box>
          </Box>
          <SimpleGrid minChildWidth={280} gap={3} spacingX={5} >
            {
                template && template.map((items, index) =>{
                  return <TemplateCard key={index} templateId={items.id} />
                })
            }
            {
                template.length === 0 &&
                <Box display='flex' justifyContent='center'>
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
          <Pagination
          pagination={pagination} onPageChange={handlePageChange}/>
        </Box>
      </Container>
  )
}

export default Collections;