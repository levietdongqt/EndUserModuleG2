import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Image, Text, useDisclosure } from '@chakra-ui/react';
import Slider from 'react-slick';
import { useCartContext } from '../contexts/CartContext';
import { getTemplateById } from '../services/TemplateServices';

import ReviewModal from './ReviewModal';


const settings = {
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,

};

const TemplateCard = ({ templateId, isDelivered}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cookies, setCookies, removeCookie] = useCookies(['cart']);
    const { cart, setCart, refresh, setRefresh } = useCartContext();
    const navigate = useNavigate();
    const [template, setTemplate] = useState([]);
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        if (templateId) {
            getTemplateById(templateId).then((result) => {
                setTemplate(result.result);
            })
        }
    }, [templateId]);


    const onClickAddCart = () => {
        const currentIndex = cart.findIndex(item => item.id === templateId);
        if (currentIndex >= 0) {
            cart[currentIndex].amount += 1;
            cart[currentIndex].price = template.price * cart[currentIndex].amount;
            setAmount(amount + 1);
            setCookies('cart', cart, { path: '/' });
        } else {
            setCart([...cart, {
                id: templateId,
                amount: 1,
                price: template.price
            }]);
            setCookies('cart', cart, { path: '/' });
        }
        setRefresh(!refresh);
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

                        <Slider {...settings} style={{width: '358px', margin: '0 auto'}}>
                            {template.templateImages && template.templateImages.map((image, index) =>
                                 (
                                    <div key={index} style={{height: '100%', width: '100%'}}>
                                        <Image
                                            key={image.id}
                                            style={{height: '200px', width: '340px'}}
                                            objectFit='cover'
                                            src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${image.imageUrl}`}
                                            alt={image.id}
                                            onClick={() =>
                                                navigate(`/template/${template.name}`, {
                                                    state: {productId: template.id},
                                                })
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </Slider>
                    <Box
                        px={3}
                        py={5}
                        alignItems="center"
                    >
                        <Text
                            onClick={() =>
                                navigate(`/template/${template.name}`, {
                                    state: { productId: template.id },
                                })
                            }
                            style={{ textDecoration: 'underline' }}
                            fontWeight={500}
                            fontSize={18}
                            _hover={{ color:'blue.200' }}
                        >
                            {template.name}
                        </Text>
                    </Box>
                </Box>
            <ReviewModal isOpen={isOpen} onClose={onClose} productId={template.id} />
        </>
    );
}

export default TemplateCard;