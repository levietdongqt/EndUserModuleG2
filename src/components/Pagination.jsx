import React from 'react';
import PropTypes from 'prop-types';
import {Box,Button} from '@chakra-ui/react';

function Pagination(props) {
    const { pagination, onPageChange } = props;
    const { page, limit, totalRows } = pagination;

    const totalPages = Math.ceil(totalRows / limit);

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    function handlePageChange(newPage) {
        if (onPageChange) {
            onPageChange(newPage);
        }
    }

    return (
        <Box textAlign={'center'}>
            <Button
                className={`prev ${page <= 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(page - 1)}
            >
                Prev
            </Button>

            {pageNumbers.map(pageNumber => (
                <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                >
                    {pageNumber}
                </Button>
            ))}

            <Button
                className={`next ${page >= totalPages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(page + 1)}
            >
                Next
            </Button>
        </Box>
    );
}

Pagination.propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageChange: PropTypes.func
};

Pagination.defaultProps = {
    onPageChange: null
};

export default Pagination;
