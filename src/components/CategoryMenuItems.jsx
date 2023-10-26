import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@chakra-ui/react';

import { getCategoryById } from '../services/CategoryServices';

const CategoryMenuItems = ({ genreId }) => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCategoryById(genreId).then((result) => {
            setCategories(result.result);
        });
    }, [genreId]);

    const handleClick = (id, categoryName, collectionName) => {
        navigate(`/categories/${categoryName}/collection/${collectionName}/`, {
            state: { collectionsId: id },
        });
    };

    return (
        categories && Array.isArray(categories) && categories.map((category) => (
            category.collections && Array.isArray(category.collections) && category.collections.map((collection) => (
                <MenuItem
                    key={collection.id}
                    cursor={'pointer'}
                    fontSize={18}
                    fontWeight={700}
                    onClick={() => handleClick(collection.id, category.name, collection.name)}
                >
                    {collection.name}
                </MenuItem>
            ))
        ))
    );

};

export default CategoryMenuItems;
