import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Box, MenuGroup, MenuDivider } from '@chakra-ui/react';
import { Edit, ExitToApp, Favorite, Inventory, MapsHomeWork, Menu as MenuIcon, Person, Report, ShoppingBag, ShoppingCart } from '@mui/icons-material';

import { getAllTemplate } from '../services/TemplateServices';
import { useUserContext } from '../contexts/UserContext';
import CategoryMenuItems from './CategoryMenuItems';

const Hamburger = ({ base, sm, md }) => {

    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const [templates, setTemplate] = useState([]);

    useEffect(() => {
        getAllTemplate()
            .then((result) => {
                setTemplate(result.result);
            });
    }, []);

    const onClickLogout = () => {

    };

    return (
        <Box display={{ base: base, sm: sm, md: md }} p={1} alignItems='center' >
            <Menu >
                <MenuButton
                    as={IconButton}
                    color='facebook.500'
                    fontSize={40}
                    icon={<MenuIcon fontSize='40px' />}
                    variant='ghost'
                    maxWidth='50px'
                />
                <MenuList
                    width='100vw'
                    zIndex={200}
                >
                    {
                        currentUser &&
                        <MenuGroup title='Account'>
                            <MenuItem onClick={() => navigate('/infos')} ><Person sx={{ marginRight: 2 }} /> My Informations</MenuItem>
                            <MenuItem onClick={() => navigate('/orders')} ><ShoppingBag sx={{ marginRight: 2 }} /> Orders</MenuItem>
                            <MenuItem onClick={() => navigate('/favorites')} ><Favorite sx={{ marginRight: 2 }} />Favorites</MenuItem>
                            <MenuItem onClick={() => navigate('/cart')} ><ShoppingCart sx={{ marginRight: 2 }} />Cart</MenuItem>
                            <MenuItem onClick={onClickLogout} ><ExitToApp sx={{ marginRight: 2 }} />Log out</MenuItem>
                        </MenuGroup>
                    }{
                        !currentUser &&
                        <MenuGroup>
                            <MenuItem onClick={() => navigate('/favorites')} ><Person sx={{ marginRight: 2 }} />Login</MenuItem>
                            <MenuItem onClick={() => navigate('/favorites')} ><Favorite sx={{ marginRight: 2 }} />Favorites</MenuItem>
                            <MenuItem onClick={() => navigate('/cart')} ><ShoppingCart sx={{ marginRight: 2 }} />Cart</MenuItem>
                        </MenuGroup>
                    }
                    <MenuDivider />
                    {
                        templates && templates.map((genre) => {
                            return (
                                <MenuGroup key={genre.id} title={genre.name}>
                                    <CategoryMenuItems genreId={genre.id} />
                                </MenuGroup>
                            )
                        })
                    }
                </MenuList>
            </Menu>
        </Box>
    )
}

export default Hamburger;