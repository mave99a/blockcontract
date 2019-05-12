/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import { toAddress } from '@arcblock/did';

import { getExplorerLink } from '../libs/forge';

export default function AssetLink({ did, children, component, ...rest }) {
  const LinkComponent = component || 'a';
  return (
    <LinkComponent href={getExplorerLink(`/assets/${toAddress(did)}`)} target="_blank" {...rest}>
      {children || toAddress(did)}
    </LinkComponent>
  );
}

AssetLink.propTypes = {
  did: PropTypes.string.isRequired,
  children: PropTypes.any,
  component: PropTypes.any,
};

AssetLink.defaultProps = {
  children: null,
  component: null,
};
