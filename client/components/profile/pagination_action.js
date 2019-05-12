/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import FirstPage from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPage from '@material-ui/icons/LastPage';

export default function PaginationAction({ count, onChangePage, page, rowsPerPage }) {
  const onFirstPage = e => onChangePage(e, 0);
  const onPreviousPage = e => onChangePage(e, page - 1);
  const onNextPage = e => onChangePage(e, page + 1);
  const onLastPage = e => onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Container>
      <IconButton onClick={onFirstPage} disabled={page === 0} aria-label="First Page">
        <FirstPage />
      </IconButton>
      <IconButton onClick={onPreviousPage} disabled={page === 0} aria-label="Previous Page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={onNextPage} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Next Page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={onLastPage} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Last Page">
        <LastPage />
      </IconButton>
    </Container>
  );
}

PaginationAction.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Container = styled.div`
  flex-shrink: 0;
  color: ${props => props.theme.palette.text.secondary};
`;
