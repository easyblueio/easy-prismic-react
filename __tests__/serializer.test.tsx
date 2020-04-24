import React from 'react';
import ReactDOM from 'react-dom/server';
import { PrismicHTMLSerializer } from '../src';
import { PrismicDocument } from '../typings/prismic';
import {
  serializeHyperlink,
  serializeImage,
  serializeSpan,
  serializeStandardTag,
} from '../src/serializers';

export function hrefResolver(doc: PrismicDocument<any>): string {
  switch (doc.type) {
    case 'some_content_type':
      return `/your/route/${doc.uid}`;
    default:
      return '/';
  }
}

export function linkResolver(doc: PrismicDocument<any>): string {
  switch (doc.type) {
    case 'some_content_type':
      return `/your/route/${doc.uid}`;
    default:
      return '/';
  }
}

describe('HTML serializer', () => {
  it('Should instantiate', () => {
    const serializer = new PrismicHTMLSerializer({ hrefResolver, linkResolver });
    expect(serializer).toBeInstanceOf(PrismicHTMLSerializer);
  });

  it('Should fail when resolvers are missing', () => {
    expect(() => {
      // @ts-ignore
      new PrismicHTMLSerializer();
    }).toThrow(new Error('Both hrefResolver and linkResolver are required.'));
  });

  it('Should have default serializers available', () => {
    expect(Object.keys(PrismicHTMLSerializer.serializers)).toEqual([
      'serializeHyperlink',
      'serializeImage',
      'serializeSpan',
      'serializeLabel',
      'serializeStandardTag',
    ]);
  });

  it('Should serialize hyperlinks', () => {
    const element = {
      start: 68,
      end: 93,
      type: 'hyperlink',
      data: {
        link_type: 'Web',
        url: 'http://google.com',
        target: '_blank',
      },
    };
    const serialized = ReactDOM.renderToString(
      serializeHyperlink(linkResolver, element, [['hyperlink content']], 0)
    );
    const expected = ReactDOM.renderToString(
      <a href="http://google.com" target="_blank" rel="noopener">
        hyperlink content
      </a>
    );

    expect(serialized).toEqual(expected);
  });

  it('Should serialize images', () => {
    const element = {
      type: 'image',
      url: 'https://images.prismic.io/image.png?auto=compress,format',
      alt: null,
      copyright: null,
      dimensions: { width: 260, height: 260 },
    };
    const serialized = ReactDOM.renderToString(serializeImage(linkResolver, element, 0));
    const expected = ReactDOM.renderToString(
      <p className=" block-img">
        <img src="https://images.prismic.io/image.png?auto=compress,format" alt="" />
      </p>
    );

    expect(serialized).toEqual(expected);
  });

  it('Should serialize spans', () => {
    // Plain text
    expect(ReactDOM.renderToString('My span content')).toEqual(
      ReactDOM.renderToString(serializeSpan('My span content'))
    );
    // Linebreaks
    expect(
      ReactDOM.renderToString(
        <>
          My <br /> span <br /> content
        </>
      )
    ).toEqual(ReactDOM.renderToString(serializeSpan('My \n span \n content')));
    // Empty content
    expect('').toEqual(ReactDOM.renderToString(serializeSpan(null)));
  });

  it('Should serialize labels', () => {
    const element = {
      type: 'image',
      url: 'https://images.prismic.io/image.png?auto=compress,format',
      alt: null,
      copyright: null,
      dimensions: { width: 260, height: 260 },
    };
    const serialized = ReactDOM.renderToString(serializeImage(linkResolver, element, 0));
    const expected = ReactDOM.renderToString(
      <p className=" block-img">
        <img src="https://images.prismic.io/image.png?auto=compress,format" alt="" />
      </p>
    );

    expect(serialized).toEqual(expected);
  });

  it('Should serialize standard tags', () => {
    const element = {
      type: 'heading2',
      text: 'This is a second level title',
      spans: [{ start: 0, end: 28, type: 'span' }],
    };
    const children = [['This is a second level title']];
    const serialized = ReactDOM.renderToString(serializeStandardTag('h2', element, children, 0));
    const expected = ReactDOM.renderToString(<h2>This is a second level title</h2>);

    expect(serialized).toEqual(expected);
  });

  it('Should serialize a richtext', () => {
    const serializer = new PrismicHTMLSerializer({ hrefResolver, linkResolver });
    const richText: any = [
      { type: 'heading2', text: 'Testing serialization', spans: [] },
      {
        type: 'paragraph',
        text: 'This is a test that ensures your prismic content is serialized !',
        spans: [
          { start: 10, end: 14, type: 'strong' },
          { start: 41, end: 48, type: 'em' },
        ],
      },
    ];
    const serialized = ReactDOM.renderToString(serializer.renderRichText(richText));
    const expected = ReactDOM.renderToString(
      <>
        <h2>Testing serialization</h2>
        <p>
          This is a <strong>test</strong> that ensures your prismic <em>content</em> is serialized !
        </p>
      </>
    );

    expect(serialized).toEqual(expected);
  });

  it('Should serialize a richtext with a custom serializer', () => {
    function CustomHeading({ children }): React.ReactElement {
      return <h2 style={{ color: 'red' }}>{children}</h2>;
    }
    const serializer = new PrismicHTMLSerializer({
      hrefResolver,
      linkResolver,
      customSerializers: {
        ['heading2']: ({ children, index }) => (
          <CustomHeading key={`h2-${index}`}>{children}</CustomHeading>
        ),
      },
    });
    const richText: any = [{ type: 'heading2', text: 'Testing h2 custom serializer', spans: [] }];
    const serialized = ReactDOM.renderToString(serializer.renderRichText(richText));
    const expected = ReactDOM.renderToString(
      <h2 style={{ color: 'red' }}>Testing h2 custom serializer</h2>
    );

    expect(serialized).toEqual(expected);
  });
});
