<center><img src="https://i.imgur.com/bo6FcQ7.png" alt="Easyblue" /></center>

## easy-prismic-react

![Statements](https://img.shields.io/badge/Coverage-80.65%25-yellow.svg "Make me better!") ![Branches](https://img.shields.io/badge/Coverage-62.35%25-red.svg "Make me better!") ![Functions](https://img.shields.io/badge/Coverage-90%25-brightgreen.svg "Make me better!") ![Lines](https://img.shields.io/badge/Coverage-80.65%25-yellow.svg "Make me better!")

[![npm](https://img.shields.io/npm/v/easy-prismic-react.svg?style=flat-square)](https://www.npmjs.com/package/easy-prismic-react)
[![npm](https://img.shields.io/npm/dm/easy-prismic-react.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/easy-prismic-react)
[![github release](https://img.shields.io/github/release/easyblueio/easy-prismic-react.svg?style=flat-square)](https://github.com/easyblueio/easy-prismic-react/releases)
[![github issues](https://img.shields.io/github/issues/easyblueio/easy-prismic-react.svg?style=flat-square)](https://github.com/easyblueio/easy-prismic-react/issues)
[![github closed issues](https://img.shields.io/github/issues-closed/easyblueio/easy-prismic-react.svg?style=flat-square&colorB=44cc11)](https://github.com/easyblueio/easy-prismic-react/issues?q=is%3Aissue+is%3Aclosed)

A better way of using Primsic with react. This package doubles as an HTML serializer and an API wrapper. Modern, tested and fully written in typescript.

Based on  [prismic-reactjs](https://github.com/prismicio/prismic-reactjs) and written here at [easyblue.io](https://www.easyblue.io/), a french insurtech company. Check out our website to see how we're using prismic and this package in production.

 ## Installation
 
 `yarn install easy-prismic-react` or `npm install easy-prismic-react`

## Basic Usage

### HTML Serializer

```typescript
import { PrismicHTMLSerializer, PrismicDocument } from 'easy-prismic-react';

export function linkResolver(doc: PrismicDocument<any>): string {
  switch (doc.type) {
    case 'some_content_type':
      return `/your/route/${doc.uid}`;
    default:
      return '/';
  }
}

const easyPrismicReact = new PrismicHTMLSerializer({ linkResolver });

function MyComponent () {
    return easyPrismicReact.renderRichText(this.props.someRichText);
}
```

### API Wrapper

```typescript
import { PrismicAPIWrapper, PrismicDocument, PrismicElement } from 'easy-prismic-react';

// The following type lists your prismic custom types ids.
type TContentTypes = 'blog_post' | 'product_page' | 'faq_page';
// You should use an interface for each custom type, this will allow you to have a better type definition throughout your code.
interface BlogPost {
    title: string;
    content: PrismicElement[];
}

// Instantiate the API wrapper with your prismic endpoint
const apiWrapper = new PrismicAPIWrapper<TContentTypes>({ endpoint: 'https://your-prismic-repo.cdn.prismic.io/api/v2' });

// Simple function that fetches blog posts by only returning content with the `blog_post` type
// If you're fetching data from the server side, use a req-like object from express or next for instance.
// If you're fetching from the client side, just use null instead.
export async function getBlogPost(reqLikeObject: IncomingMessage): Promise<PrismicDocument<BlogPost>> {
  return apiWrapper.getContent<BlogPost>(
    reqLikeObject,
    apiWrapper.getContentByType('blog_post')
  );
}
```
