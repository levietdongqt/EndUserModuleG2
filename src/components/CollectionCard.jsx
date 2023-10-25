import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Image, Text} from '@chakra-ui/react';
import { useUserContext } from '../contexts/UserContext';
import { getCollectionById } from '../services/CollectionServices';
import {getCategoryById} from "../services/CategoryServices";

const CollectionCard = ({ collectionId,categoryId}) => {
  const [cookies, setCookies, removeCookie] = useCookies(['cart']);
  const { currentUser } = useUserContext();
  const navigate = useNavigate();
  const [collections, setcollection] = useState([]);
  const [category, setcategory] = useState([]);
  const [amount, setAmount] = useState(0);
    useEffect(() => {
        if (collectionId) {
            getCollectionById(collectionId).then((result) => {
                setcollection(result.result);
            })
            getCategoryById(categoryId).then((result) => {
                setcategory(result.result);
            })
        }
    }, [collectionId,categoryId, amount]);

    const handleClick = (id) => {
        navigate(`/categories/${category.name}/collection/${collections.name}/`, { state: { collectionsId: id } });
    };
  return (
      <>
            <Box
                width='100%'
                display='flex'
                alignItems='center'
                flexDirection='column'
                cursor='pointer'
                mt={{ base: 3, sm: 0 }}
                mx={{ base: 0, md: 2 }}
            >
                  <div style={{ height: '100%', width: '100%' }}>
                    <Image
                        style={{ height: '333px', width: '100%' }}
                        objectFit='cover'
                        src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${collections.imageUrl}`}
                        onClick={() => handleClick(collections.id) }
                        loading={'lazy'}
                         />
                  </div>

              <Box px={0} py={5} bg='#fff' position='relative' width='100%' height={100} maxWidth={500}>
                <Text
                    onClick={() => handleClick(collections.id)}
                    fontWeight={650}
                    fontSize={18}
                    color={'#0a1414'}
                    style={{textDecoration: 'underline'}}
                    _hover={{color:'blue.300'}}
                    display="inline"
                    textAlign={'left'}
                >
                  {collections.name} 
                </Text>
              </Box>
            </Box>
      </>

  );
}

export default CollectionCard;