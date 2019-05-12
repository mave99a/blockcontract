import React from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/lib/useAsync';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Layout from '../../components/layout';
import api from '../../libs/api';

export default function ContractDetail({ query }) {
  const detail = useAsync(async () => {
    const res = await api.get(`/api/contracts/${query.id}`);
    if (res.status === 200) {
      res.data.content = Buffer.from(res.data.content, 'base64').toString('utf8');
      return res.data;
    }

    throw new Error('Contract load failed');
  });

  if (detail.loading || !detail.value) {
    return (
      <Layout title="Contract">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (detail.error) {
    return (
      <Layout title="Contract">
        <Main>{detail.error.message}</Main>
      </Layout>
    );
  }

  return (
    <Layout title="Contract">
      <Main>
        <div className="form">
          <Typography component="h3" variant="h4" className="form-header">
            Contract Detail
          </Typography>
          <pre>
            <code>{JSON.stringify(detail.value, true, '  ')}</code>
          </pre>
        </div>
      </Main>
    </Layout>
  );
}

ContractDetail.getInitialProps = ({ query }) => ({ query });

ContractDetail.propTypes = {
  query: PropTypes.object.isRequired,
};

const Main = styled.main`
  margin: 80px 0;
`;
