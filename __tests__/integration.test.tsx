import React from 'react';
import ReactDOM from 'react-dom/server';
import { PrismicAPIWrapper, PrismicHTMLSerializer } from '../src';
import { BlogPost, ENDPOINT, TContentTypes } from './apiWrapper.test';
import { hrefResolver, linkResolver } from './serializer.test';

describe('Integration tests', () => {
  it('Should fetch blog post by UID then serialize it', async () => {
    const UID = 'this-is-a-custom-uid';
    const apiWrapper = new PrismicAPIWrapper<TContentTypes>({ endpoint: ENDPOINT });
    const blogPost = await apiWrapper.getContent<BlogPost>(
      null,
      apiWrapper.getContentByUID('blog_post', UID)
    );
    const data = blogPost?.results[0]?.data;

    const serializer = new PrismicHTMLSerializer({ hrefResolver, linkResolver });
    const serialized = ReactDOM.renderToString(serializer.renderRichText(data.rich_text));
    const expected = ReactDOM.renderToString(
      <>
        <p>You can get this blog post directly by using :</p>
        <pre>getContentByUID</pre>
      </>
    );

    expect(serialized).toEqual(expected);
  });
});
