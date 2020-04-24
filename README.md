<center><img src="https://i.imgur.com/bo6FcQ7.png" alt="Easyblue" /></center>

![Lines](https://img.shields.io/badge/Coverage-80.65%25-yellow.svg "Make me better!")
[![npm](https://img.shields.io/npm/v/easy-prismic-react.svg?style=flat-square)](https://www.npmjs.com/package/easy-prismic-react)
[![npm](https://img.shields.io/npm/dm/easy-prismic-react.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/easy-prismic-react)
[![github release](https://img.shields.io/github/release/easyblueio/easy-prismic-react.svg?style=flat-square)](https://github.com/easyblueio/easy-prismic-react/releases)
[![github issues](https://img.shields.io/github/issues/easyblueio/easy-prismic-react.svg?style=flat-square)](https://github.com/easyblueio/easy-prismic-react/issues)
[![github closed issues](https://img.shields.io/github/issues-closed/easyblueio/easy-prismic-react.svg?style=flat-square&colorB=44cc11)](https://github.com/easyblueio/easy-prismic-react/issues?q=is%3Aissue+is%3Aclosed)

## easy-prismic-react

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

### Custom serializers

Although the serializer takes care of turning your WYSIWYG content into proper HTML, you might need to customize how your content is rendered.

The most common use case is the hyperlink serializer. By default, this package will render a plain `<a>` tag. You might want to replace that with your own router like react-router or next's router.

In order to set up your own serializers, you need to pass a object when instantiating `PrismicHTMLSerializer` like so :

```typescript jsx
const apiWrapper = new PrismicAPIWrapper({
    endpoint: 'https://your-prismic-repo.cdn.prismic.io/api/v2',
    customSerializers: {
        'hyperlink': (params: SerializeParams) => {
            return (
                 <MyNavigationComponent />
            );
        }
    }
});
```

Your function will receive a `params` argument with everything you might need in order to tweak your rendering. Take a look at the `SerializeParams` interface.

> 💡 You can override all tags that are handled by the serializer, check the `ElementTypes` enum for the complete list.

### The `getURL` method

If you need to transform a prismic link (`PrismicLink`) object into a string, you can use the `getURL(prismicLink: PrismicLink): string` method once your serializer is instantiated.

### Full API

```typescript

class PrismicHTMLSerializer {
    public static serializers; // Default serializers you might want to use yourself

    constructor(params: SerializerSetupParams);

    public renderRichText(richText: PrismicElement[], Component: any = Fragment, componentProps = {}, options: SerializeOptions = {}, context?: any): ReactElement;
    public getURL(prismicLink: PrismicLink): string;
}

class PrismicAPIWrapper<TContentTypes> {
    constructor(params: WrapperSetupParams);
    
    public async initAPI(req: any): Promise<ResolvedApi>;
    public async getContent<T>(req: any, query: string[], queryOptions: QueryOptions = {}): Promise<SearchResponse<T>>;
    public getContentByType(type: TContentTypes): string[];
    public getContentByUID(page: TContentTypes, uid: string): string[];
    // TODO : every stripe API parameter needs to have a dedicated method
}
```

### Advanced usage : custom embeds and the `context` param

Prismic is a double edged sword : it's very lightweight and easy to pick up, but it might lack some features if you need to render more complicated content inside the WYSIWYG editor. `easy-prismic-react` lets you get started quickly, while also giving you leeway in order to implement advanced features.

For [our blog](http://easyblue.io/blog), we wanted to display banners with internal links in the middle of articles. Setting up a banner needs to be easy for contributors whilst letting them customizing their content. Here's how it turned out :

![Prismic custom embed easy-prismic-react easyblue](https://i.imgur.com/eJqTSyo.png)

The first step is to [customize](#custom-serializers) the `<pre>` renderer in order to parse these "shortcodes" of some kind.

```typescript jsx
const easyPrismicReact = new PrismicHTMLSerializer({
  linkResolver,
  customSerializers: {
    ['preformatted']: (params: SerializeParams) => {
      const { index, context } = params; // Note how we get the context here
      // Some logic here in order to find out which embed is being used (or none at all)...
      switch (embed) {
        case RELATED_POST_SHORT_CODE:
          return (<RelatedPostEmbed key={`embed-${index}`} postContext={context}/>);
        // More cases...
        default:
        // This doesn't look like a short code, use the default serializer that's available as a static method
          return PrismicHTMLSerializer.serializers.serializeStandardTag('pre', element, children, index);
      }
    }
  }
});
```

The second step is to pass a `context` when calling the serializer. This will let us pass _any_ data that we will get back in our `params` argument, inside the custom serializer.

In our blog post component :

```typescript jsx
function BLogPost () {
    const blogPostContext = {}; // Fetch related posts data here
    return (
        <div>
            { easyPrismicReact.renderRichText(content, Fragment, {}, {}, blogPostContext) }
        </div>
    );
}
```

Thanks to this feature, we can access our related posts data that we [fetched](#api-wrapper) earlier, and render a proper link, like so :

```typescript jsx
const RelatedPostEmbed = ({ postContext }) => {
  // Extract the related post data from the context we passed a react prop earlier 
  const relatedPost = getRelatedPost(postContext);
  const { data } = relatedPost;

  // Render our custom router component leading to the related post
  return (
    <YourCustomRouter href={...}>
        <PostImage image={data.image.url} />
          Related post
          <h4>{data?.title}</h4>
    </YourCustomRouter>
  );
};
```
