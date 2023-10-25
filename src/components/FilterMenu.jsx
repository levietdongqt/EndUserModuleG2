
import React, { useEffect } from 'react';
import { Box, Text, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';

import { useSearchContext } from '../contexts/SearchContext';

const FilterMenu = ({ setProducts, setSortBy }) => {
    const { canSearch, setCanSearch } = useSearchContext();

    const [minPrice, setMinPrice] = useState(30);
    const [maxPrice, setMaxPrice] = useState(250);
    const [gender, setGender] = useState("all");
    const [color, setColor] = useState("all");

    useEffect(() => {
        setColor("all");
        setGender("all");
        setMinPrice(30);
        setMaxPrice(250);
    }, [canSearch]);


    return (
        <Box
            display={'flex'}
            minHeight={200}
            maxHeight={200}
            p={3}
            backgroundColor='#fff'
            maxWidth={600}
            width={600}
            flexDirection="column"
        >
            <Text fontSize={20} mb={3} fontWeight={500} >Filter Size</Text>
            <Checkbox
                colorScheme='facebook'
                value='XS'
                fontWeight={600}
                sx={{
                    '.chakra-checkbox__control': {
                        borderColor: '#000',
                        width: '30px',
                        height: '30px',
                        transition: 'border-color 0.3s', // Thêm hiệu ứng transition cho đường viền
                        borderRadius: '50%', // Đặt viền thành hình tròn
                        '&:hover': {
                            borderColor: '#ff0000', // Màu đường viền khi hover
                        },
                    },
                    '.chakra-checkbox__label': {
                        paddingLeft: '10px',
                    },
                    '.chakra-checkbox__icon': {
                        width: '24px',
                        height: '24px',
                        transform: 'scale(1.2)', // Tăng kích thước của dấu check
                        '&:before': {
                            content: '""',
                            display: 'block',
                            borderTop: '2px solid #fff', // Tạo dấu check
                            borderRight: '2px solid #fff',
                            width: '50%',
                            height: '100%',
                            transform: 'rotate(-45deg)', // Xoay dấu check
                        },
                    },
                }}
            >
                XS
            </Checkbox>
        </Box>
    );
}

export default FilterMenu;
