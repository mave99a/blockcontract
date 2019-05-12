/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

import PaginationAction from './pagination_action';

export default function EnhancedTable({ rows, headers, page, rowsPerPage, renderRow, onChangePage }) {
  const pagedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Table padding="none">
        <TableHead>
          <TableRow>
            {headers.concat(['Action']).map((x, i) => (
              <TableCell key={x} align={i === headers.length ? 'center' : 'left'}>
                {x}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody key={`${page}-${rowsPerPage}`}>{pagedRows.map(x => renderRow(x))}</TableBody>
      </Table>
      {rowsPerPage < rows.length && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[10]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(e, p) => onChangePage(p)}
          ActionsComponent={PaginationAction}
        />
      )}
    </Container>
  );
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

const Container = styled.div``;
