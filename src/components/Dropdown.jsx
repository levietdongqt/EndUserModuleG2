import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDisclosure, MenuItem, Menu, MenuButton, MenuList, Box, Grid, GridItem, Heading, Image, Link,Button } from '@chakra-ui/react';
import { getCategoryById } from '../services/CategoryServices';

const Dropdown = ({ title, CategoryId }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [category, setCategory] = useState(null);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        try {
            getCategoryById(CategoryId)
                .then((result) => {
                    setCategory(result.result);
                    result.result.collections.forEach((item) => {
                            if(item.templateDTO.length >0){
                                setIsShow(true);
                            }}
                        )
                    })
        } catch (error) {
            console.log(error);
        }
    }, [CategoryId]);

    const handleClick = (categoryId) => {
        if (category) {
            navigate(`/categories/${category.name}`, { state: { categoryId: categoryId } });
        }
    };

    return (
        isShow ? <Box px={{ base: 2, md: 4 }} py={{ base: 1, md:1 }}>
            <Menu isOpen={isOpen}>
                <MenuButton
                    color='black'
                    fontSize={20}
                    fontWeight={500}
                    variant='outline'
                    onMouseEnter={onOpen}
                    onMouseLeave={onClose}
                    borderBottom='3px solid white'
                    transition={.5}
                    _hover={{ color: 'facebook.500', borderBottom: '3px solid #385898' }}
                    onClick={() => handleClick(category.id)}
                >
                    {title}
                </MenuButton>
                <MenuList onMouseEnter={onOpen} onMouseLeave={onClose} mb="1px">
                    <Grid
                        templateColumns='repeat(4, 1fr)'
                        width="100vw"
                        gap={3}
                        mt="22px"
                        display={'flex'}
                        justifyContent={'center'}
                        boxShadow="0px 2px 8px rgba(0, 0, 0, 0.2)"
                        borderRadius="8px"
                        pb="20px"
                    >
                        {category && (
                            <React.Fragment key={category.name}>
                                {category.collections.map((collection) => {
                                    return (
                                        <GridItem key={collection.id} display={'inline-block'} mr={10}>
                                            <div>
                                                <Menu>
                                                    <MenuItem>
                                                        <Heading
                                                            as='h4'
                                                            size='md'
                                                            onClick={() =>navigate(`/categories/${category.name}/collection/${collection.name}/`, { state: { collectionsId: collection.id } }) }
                                                            cursor={'pointer'}
                                                            _hover={{ color: 'grey' }}
                                                        >
                                                            {collection.name}
                                                        </Heading>
                                                    </MenuItem>
                                                    {collection.templateDTO.slice(0,6).map((template) => {
                                                        return (
                                                            <MenuItem key={template.id}>
                                                                <Link onClick={() =>
                                                                    navigate(`/template/${template.name}`, {
                                                                        state: {productId: template.id},
                                                                    })
                                                                }>{template.name}</Link>
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Menu>
                                            </div>
                                        </GridItem>
                                    );
                                })}
                                <GridItem key={category.id} mr="30px" display={'inline-block'}>
                                    <Menu textAlign={'center'}>
                                        <MenuItem>
                                            <Image
                                                w="280px"
                                                h="220px"
                                                maxW={'100%'}
                                                src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${category.imageUrl}`}
                                            />
                                        </MenuItem>
                                        <MenuItem>Check out {category.name} now!!!</MenuItem>
                                        <MenuItem>
                                            <Link fontSize='md' as='b' >Shop now</Link>
                                        </MenuItem>
                                    </Menu>
                                </GridItem>
                            </React.Fragment>
                        )}
                    </Grid>
                </MenuList>
            </Menu>
        </Box> : ''
    );
};

export default Dropdown;