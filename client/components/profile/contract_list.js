/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTheme } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import WaitIcon from '@material-ui/icons/HourglassEmpty';

import EnhancedTable from './enhanced_table';

// eslint-disable-next-line object-curly-newline
function ContractList({ contracts, timeFn, timeHeader, action, theme }) {
  const [page, setPage] = useState(0);

  if (contracts.length === 0) {
    return (
      <Typography className="tip" component="p">
        No contract found
      </Typography>
    );
  }

  const renderRow = contract => (
    <TableRow key={contract._id}>
      <TableCell width="30%">{contract._id}</TableCell>
      <TableCell width="30%">{contract.synopsis}</TableCell>
      <TableCell width="10%">{moment(timeFn(contract)).format('YYYY-MM-DD HH:mm')}</TableCell>
      <TableCell width="10%" align="center">
        {contract.finished ? (
          <CheckIcon style={{ color: theme.colors.green }} />
        ) : (
          <WaitIcon style={{ color: theme.colors.red }} />
        )}
      </TableCell>
      <TableCell width="10%" align="center">
        <Button href={`/contracts/detail?contractId=${contract._id}`} variant="outlined" size="small" color="primary">
          {action}
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <EnhancedTable
      headers={['ID', 'Contract Summary', timeHeader, 'Status']}
      rows={contracts}
      renderRow={renderRow}
      page={page}
      rowsPerPage={10}
      onChangePage={setPage}
    />
  );
}

ContractList.propTypes = {
  contracts: PropTypes.array.isRequired,
  timeFn: PropTypes.func.isRequired,
  timeHeader: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme()(ContractList);
