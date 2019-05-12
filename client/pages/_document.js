/* eslint import/no-extraneous-dependencies:"off" */
/* eslint implicit-arrow-linebreak:"off" */
/* eslint function-paren-newline:"off" */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import JssProvider from 'react-jss/lib/JssProvider';
import Helmet from 'react-helmet';

import getContext from '../libs/context';

export default class StyledDocument extends Document {
  static getInitialProps(ctx) {
    // Resolution order
    //
    // On the server:
    // 1. page.getInitialProps
    // 2. document.getInitialProps
    // 3. page.render
    // 4. document.render
    //
    // On the server with error:
    // 2. document.getInitialProps
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. page.getInitialProps
    // 3. page.render

    const sheet = new ServerStyleSheet();

    // Get the context to collected side effects.
    const context = getContext();
    const page = ctx.renderPage(App => props =>
      sheet.collectStyles(
        <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
          <App {...props} />
        </JssProvider>
      )
    );

    return {
      ...page,
      helmet: Helmet.renderStatic(),
      styleTags: sheet.getStyleElement(),
      stylesContext: context,
      styles: (
        <style
          id="jss-server-side"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: context.sheetsRegistry.toString() }}
        />
      ),
    };
  }

  // should render on <html>
  helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  // should render on <body>
  helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  // should render on <head>
  helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map(el => this.props.helmet[el].toComponent());
  }

  render() {
    return (
      <html lang="en" {...this.helmetHtmlAttrComponents()}>
        <Head>
          {this.props.styleTags}
          {this.helmetHeadComponents()}
        </Head>
        <body style={{ padding: 0, margin: 0 }} {...this.helmetBodyAttrComponents()}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
