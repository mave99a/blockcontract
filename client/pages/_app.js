import React from 'react';
import App, { Container } from 'next/app';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import Helmet from 'react-helmet';

import getPageContext from '../libs/context';

const GlobalStyle = createGlobalStyle`
  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }

  pre,code {
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
      Courier New, monospace, serif;
  }

  pre {
    margin-bottom: 10px;
    border-radius: 10px;
    line-height: 1.5rem;
    padding: 25px;
    color: #ffffff;
    background-color: #222222;
  }
`;

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          title={process.env.appName}
          meta={[
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}>
          <link rel="shortcut icon" href="/static/favicon.ico" />
        </Helmet>
        <JssProvider registry={this.pageContext.sheetsRegistry} generateClassName={this.pageContext.generateClassName}>
          <MuiThemeProvider theme={this.pageContext.theme} sheetsManager={this.pageContext.sheetsManager}>
            <ThemeProvider theme={this.pageContext.theme}>
              <React.Fragment>
                <CssBaseline />
                <GlobalStyle />
                <Component pageContext={this.pageContext} {...pageProps} />
              </React.Fragment>
            </ThemeProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
