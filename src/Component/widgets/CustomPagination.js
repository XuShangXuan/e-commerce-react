import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = ({ genericPageable, onClickPage }) => {

    const { currentPage, pageRange, pageTotalCount } = genericPageable;

    return (
        <Pagination>
            <Pagination.First onClick={() => onClickPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => onClickPage(currentPage - 1)} disabled={currentPage === 1} />
            {pageRange.map((p, index) => (
                <Pagination.Item key={index} onClick={() => onClickPage(p)} active={p === currentPage}>
                    {p}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => onClickPage(currentPage + 1)} disabled={pageTotalCount === currentPage} />
            <Pagination.Last onClick={() => onClickPage(pageTotalCount)} disabled={pageTotalCount === currentPage} />
        </Pagination>
    );
};

export default CustomPagination;
