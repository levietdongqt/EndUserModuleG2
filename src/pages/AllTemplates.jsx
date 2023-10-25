import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, SimpleGrid, Button, Select, Text, Icon, Heading, Container } from '@chakra-ui/react';
import queryString from 'query-string';
import TemplateCard from '../components/templateCard';
import FilterMenu from '../components/FilterMenu';
import { getAllTemplates } from '../services/TemplateServices';
import { SearchOff } from '@mui/icons-material';
import Pagination from '../components/Pagination';

const AllTemplates = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const page = queryParams.page ? parseInt(queryParams.page) : 1;

    const [template, setTemplates] = useState([]);
    const [sortBy, setSortBy] = useState("recommended");
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState({
        page: page,
        limit: 15,
        totalRows: 1,
    });

    const [filters, setFilters] = useState({
        limit: 15,
        page: page, // Sử dụng trang mặc định là 1 nếu page không
    });

    const loadTemplates = (paramsString) => {
        // Hàm tải dữ liệu từ API
        getAllTemplates(paramsString)
            .then((result) => {
                setTemplates(result.result.items);
                setTotal(result.result.totalRows);
                setPagination({
                    totalRows: result.result.totalRows,
                    limit: result.result.limit,
                    page: filters.page,
                });
            });
    };

    useEffect(() => {
        const query = new URLSearchParams(search);
        const page = parseInt(query.get('page')) || 1;

        const storedPage = localStorage.getItem('templatePage');
        const initialPage = storedPage ? parseInt(storedPage) : page;

        setFilters({ ...filters, page: initialPage });
    }, [search]);

    useEffect(() => {
        const paramsString = queryString.stringify(filters, { skipEmptyString: true });
        // Cập nhật tham số trang (page) trong URL
        navigate(`/allTemplates?page=${filters.page}`);

        // Gọi hàm loadTemplates để tải dữ liệu từ API
        loadTemplates(paramsString);
    }, [filters, navigate]);

    const handlePageChange = newPage => {
        setFilters({ ...filters, page: newPage });
        localStorage.setItem('templatePage', newPage);
        navigate(`/allTemplates?page=${newPage}`);
    };

    const handleChange = (e) => {
        if (e.target.value === "lowest") {
            sortByPriceAsc();
        } else if (e.target.value === "highest") {
            sortByPriceDesc();
        }
        setSortBy(e.target.value);
    };

    const sortByPriceAsc = () => {
        const sortedTemplate = [...template].sort((a, b) => a.pricePlusPerOne - b.pricePlusPerOne);
        setTemplates(sortedTemplate);
    };

    const sortByPriceDesc = () => {
        const sortedTemplate = [...template].sort((a, b) => b.pricePlusPerOne - a.pricePlusPerOne);
        setTemplates(sortedTemplate);
    };

    return (
        <Container maxW='1140px'>
            <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3}>
                <Box textAlign={'center'} mb={3}>
                    <Heading as='h2' size='3xl'>
                        Shop all Templates
                    </Heading>
                </Box>
                <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="flexStart"
                    py={5}
                >
                    <FilterMenu
                        columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
                        setProducts={template}
                        setSortBy={setSortBy}
                    />
                    <Box display={'flex'} m={3} alignItems={'center'}>
                        <Text fontSize={16} fontWeight={500} mb={0} float={'right'}>&nbsp;{total} Results</Text>
                        <Select colorScheme='facebook' onChange={handleChange} value={sortBy} backgroundColor='#fff'
                                width='170px'>
                            <option value='recommended'>Best Sellers</option>
                            <option value='lowest'>Lowest Price</option>
                            <option value='highest'>Highest Price</option>
                        </Select>
                    </Box>
                </Box>
                <SimpleGrid minChildWidth={280} gap={3} spacingX={5}>
                    {template.length > 0 ? (
                        template.map((items, index) => {
                            return <TemplateCard key={index} templateId={items.id} />;
                        })
                    ) : (
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
                                <Heading textAlign='center' fontSize={30} mt={8}>Sorry, we couldn't find what you are
                                    looking for.</Heading>
                                <Text textAlign='center' fontSize={24} mt={2} fontWeight={300}>But don’t give up! Check
                                    out our bestsellers and find something for you!</Text>
                                <Button
                                    variant='solid'
                                    fontSize={20}
                                    px={10} mt={10}
                                    colorScheme='facebook'
                                    onClick={() => navigate('/')}
                                >
                                    Start Shopping
                                </Button>
                            </Box>
                        </Box>
                    )}
                </SimpleGrid>
                <Pagination
                    pagination={pagination} onPageChange={handlePageChange} />
            </Box>
        </Container>
    );
};

export default AllTemplates;