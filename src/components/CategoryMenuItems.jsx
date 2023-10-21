import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@chakra-ui/react';

import { getCategoryById } from '../services/CategoryServices';

const CategoryMenuItems = ({ genreId }) => {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCategoryById(genreId)
            .then((result) => {
                setCategories(result.result);
            });
    },[genreId]);

    const handleClick = (categoryId) => {
        navigate('/search', { state: { categoryId: categoryId } });
    };

    return
        <MenuItem onClick={() => handleClick(categories.id)} >{categories.name}</MenuItem>

}

export default CategoryMenuItems;