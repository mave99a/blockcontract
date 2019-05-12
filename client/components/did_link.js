/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import { toAddress } from '@arcblock/did';

import { getExplorerLink } from '../libs/forge';

export default function DidLink({ did }) {
  return (
    <a href={getExplorerLink(`/accounts/${toAddress(did)}`)} target="_blank">
      {toAddress(did)}
    </a>
  );
}

DidLink.propTypes = {
  did: PropTypes.string.isRequired,
};
