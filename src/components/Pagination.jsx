import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@chakra-ui/react';
import styled from 'styled-components';
const ActiveButton = styled(Button)`
  background-color: green;
  color: white;
  &.active-page {
    background-color: green;
    color: white;
  }
`;
function Pagination(props) {
    const { pagination, onPageChange } = props;
    const { limit, totalRows } = pagination;

    const totalPages = Math.ceil(totalRows / limit);
    const [page, setPage] = useState(parseInt(pagination.page, 10));

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (newPage) => {
        if (onPageChange) {
            setPage(newPage);
            onPageChange(newPage);
        }
    };

    return (
        <Box textAlign={'center'}>
            <Button
                className={`prev ${page <= 1 ? 'disabled' : ''}`}
                onClick={page > 1 ? () => handlePageChange(page - 1) : undefined}
                style={{ display: page > 1 ? 'inline-block' : 'none' }}
            >
                Prev
            </Button>

            {pageNumbers.map((pageNumber) => (
                pageNumber === page ? (
                    <ActiveButton
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className="active-page"
                    >
                        {pageNumber}
                    </ActiveButton>
                ) : (
                    <Button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </Button>
                ))
            )}

            {totalPages > 1 && (
                <Button
                    className={`next ${page >= totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                    style={{ display: page >= totalPages ? 'none' : 'inline-block' }}
                >
                    Next
                </Button>
            )}
        </Box>
    );
}

Pagination.propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageChange: PropTypes.func,
};

Pagination.defaultProps = {
    onPageChange: null,
};

export default Pagination;