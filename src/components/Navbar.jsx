import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Text, Icon, Menu, MenuList, MenuItem, MenuButton, MenuGroup, Divider } from '@chakra-ui/react';
import {
  Person,
  Favorite,
  ShoppingCart,
  ExitToApp,
  ShoppingBag,
  Report,
  MapsHomeWork,
  Inventory,
  Edit,
  AttachFile, BrowseGallery, BrowseGallerySharp, Collections
} from '@mui/icons-material';

import { getAllTemplate } from '../services/TemplateServices';
import { getAllCategories } from '../services/CategoryServices';
import { useUserContext } from '../contexts/UserContext';
import { useCartContext } from '../contexts/CartContext';
import Hamburger from './Hamburger';
import Dropdown from './Dropdown';
import Searchbar from './Searchbar';
import Upload from '../pages/Upload';

const Navbar = () => {

  const [categories, setCategories] = useState([]);
  const [openUpload,setOpenUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserContext();
  const { cart, refresh } = useCartContext();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const handleCloseDialogEdit = () => {
    setOpenUpload(false);
  }

  useEffect(() => {
    getAllCategories()
      .then(result => {
        setCategories(result.result);
      });
    var count = 0;
    if (cart.length) {
      cart.forEach((item) => {
        if (item.amount) {
          count += item.amount;
        }
      });
    }
    setItemCount(count);
  }, [refresh, cart, cookies.cart]);

  const Logout = () => {
    removeCookie('currentUser', { path: '/' });
    setCurrentUser('');
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
        position='sticky'
        top='0px'
        backgroundColor='#fff'
        zIndex={500} >
        <Box
          display={'flex'}
          flexDirection={{ base: 'column', sm: 'row' }}
          justifyContent='space-between'
          py={{ base: 1, md: 2 }}
          px={{ base: 2, md: 5 }}
          width='100%'
          backgroundColor='#323264'
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent={{ base: 'space-between', sm: 'start' }}

          >
            <Text
              fontSize={40}
              fontWeight={700}
              color={'#fff'}
              letterSpacing={-2}
              cursor='pointer'
              onClick={() => navigate('/')}
            >MyImages</Text>
            <Hamburger base='flex' sm='none' md='none' />
          </Box>
          <Searchbar />
          <Box display={{ base: 'none', md: 'flex' }} alignItems='center' px={2} >
            <Box
              color='#fff'
              display='flex'
              flexDirection='column'
              cursor='pointer'
              alignItems='center'
              transition={.5}
              _hover={{ color: '#D14905' }}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              onClick={() => !currentUser && navigate('/login')}
            >
              {
                currentUser &&
                <Menu isOpen={open}>
                  <Icon fontSize={30} color='inherit' as={Person} />
                  <Text color='inherit' fontWeight={500} >Account</Text>
                  <MenuButton />
                  <MenuList >
                    <MenuGroup title='Account' >
                      <MenuItem onClick={() => navigate('/infos')} ><Person sx={{ marginRight: 2 }} /> My Informations</MenuItem>
                      <MenuItem onClick={() => navigate('/orders')} ><ShoppingBag sx={{ marginRight: 2 }} /> Orders</MenuItem>
                    </MenuGroup>
                    <Divider />
                    <MenuItem onClick={Logout} ><ExitToApp sx={{ marginRight: 2 }} /> Log out</MenuItem>
                  </MenuList>
                </Menu>
              }
              {
                !currentUser &&
                <>
                  <Icon fontSize={30} color='inherit' as={Person} />
                  <Text color='inherit' fontWeight={500} >Login</Text>
                </>
              }
            </Box>
            <Box
              color='#fff'
              display='flex'
              flexDirection='column'
              cursor='pointer'
              ml='5'
              alignItems='center'
              transition={.5}
              _hover={{ color: '#D14905' }}
              onClick={() => navigate('/favorites')}
            >
              <Icon fontSize={30} color='inherit' as={Collections} />
              <Text color='inherit' fontWeight={500} >MyImage</Text>
            </Box>
            <Box
              color='#fff'
              display='flex'
              flexDirection='column'
              cursor='pointer'
              mx='5'
              alignItems='center'
              transition={.5}
              _hover={{ color: '#D14905' }}
                onClick={() => setOpenUpload(true)}
            >
              <Icon fontSize={30} color='inherit' as={AttachFile} />
              <Text color='inherit' fontWeight={500} >UpLoad</Text>
            </Box>
            <Box
              color='#fff'
              display='flex'
              flexDirection='column'
              cursor='pointer'
              alignItems='center'
              transition={.5}
              _hover={{ color: '#D14905' }}
              onClick={() => navigate('/cart')}
            >
              <Icon fontSize={30} color='inherit' as={ShoppingCart} />
              <Text color='inherit' fontWeight={500} >{itemCount > 0 ? `Cart (${itemCount})` : 'Cart'}</Text>
            </Box>
          </Box>
          <Hamburger base='none' sm='flex' md='none' />
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          justifyContent={'center'}
          py={{ base: 1, md: 2 }}
          ps={5}
          width='100%'>
          {
            categories.map((index) => {
              return index && <Dropdown key={index.id} title={index.name} TemplateId={index.id} name={index.name} />
            })
          }
        </Box>
      </Box>
      <Upload openDialog={openUpload} handleCloseDialog={handleCloseDialogEdit} />
    </>


  )
}

export default Navbar;