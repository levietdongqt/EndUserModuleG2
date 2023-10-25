import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@chakra-ui/react';

import { getCategoryById } from '../services/CategoryServices';

const CategoryMenuItems = ({ genreId }) => {
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        getCategoryById(genreId)
            .then((result) => {
                if (isMounted) {
                    setCategory(result.result);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [genreId]);

    const handleClick = (categoryId) => {
        navigate(`/categories/${category.name}`, { state: { categoryId: categoryId } });
    };

    if (!category) {
        return null;
    }

    return (
        <MenuItem onClick={() => handleClick(category.id)} fontWeight={600} fontSize={15}>{category.name}</MenuItem>
    );
};

export default CategoryMenuItems;