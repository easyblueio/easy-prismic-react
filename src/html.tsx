import PrismicRichText, { Elements } from 'prismic-richtext';
import React, { Fragment, ReactNode } from 'react';
import {
  serializeEmbed,
  serializeHyperlink,
  serializeImage,
  serializeLabel,
  serializeSpan,
  serializeStandardTag,
} from './serializers';
import { ElementTypes, PrismicDocument, PrismicElement } from '../typings/prismic';
import { TCustomSerializers } from './index';

export interface SerializeOptions {
  removeParagraphs?: boolean;
}

export type TResolver = (doc: PrismicDocument<any>) => string;
export interface SerializeParams {
  linkResolver: TResolver;
  type: ElementTypes;
  element: PrismicElement;
  key: string;
  index: number;
  content?: string;
  children?: (string | ReactNode)[];
  options?: SerializeOptions;
  context?: any;
}

function serialize(
  params: SerializeParams,
  customSerializers: TCustomSerializers
): React.ReactElement {
  const { linkResolver, type, element, content, children, key, options } = params;

  if (customSerializers && customSerializers[type]) {
    return customSerializers[type](params);
  }

  switch (type) {
    case Elements.heading1:
      return serializeStandardTag('h1', element, children, key);
    case Elements.heading2:
      return serializeStandardTag('h2', element, children, key);
    case Elements.heading3:
      return serializeStandardTag('h3', element, children, key);
    case Elements.heading4:
      return serializeStandardTag('h4', element, children, key);
    case Elements.heading5:
      return serializeStandardTag('h5', element, children, key);
    case Elements.heading6:
      return serializeStandardTag('h6', element, children, key);
    case Elements.paragraph:
      return serializeStandardTag(
        options.removeParagraphs ? React.Fragment : 'p',
        element,
        children,
        key
      );
    case Elements.preformatted:
      return serializeStandardTag('pre', element, children, key);
    case Elements.strong:
      return serializeStandardTag('strong', element, children, key);
    case Elements.em:
      return serializeStandardTag('em', element, children, key);
    case Elements.listItem:
      return serializeStandardTag('li', element, children, key);
    case Elements.oListItem:
      return serializeStandardTag('li', element, children, key);
    case Elements.list:
      return serializeStandardTag('ul', element, children, key);
    case Elements.oList:
      return serializeStandardTag('ol', element, children, key);
    case Elements.image:
      return serializeImage(linkResolver, element, key);
    case Elements.embed:
      return serializeEmbed();
    case Elements.hyperlink:
      return serializeHyperlink(linkResolver, element, children, key);
    case Elements.label:
      return serializeLabel(element, children, key);
    case Elements.span:
      return serializeSpan(content);
    default:
      return null;
  }
}

export const renderRichText = (
  linkResolver: TResolver,
  customSerializers: TCustomSerializers,
  richText: PrismicElement[],
  Component: any = Fragment,
  componentProps = {},
  options: SerializeOptions = {},
  context?: any
): React.ReactElement => {
  if (Object.prototype.toString.call(richText) !== '[object Array]') {
    return null;
  }
  const serializedChildren = PrismicRichText.serialize(
    richText,
    (
      type: ElementTypes,
      element: PrismicElement,
      content: string,
      children: (string | ReactNode)[],
      index: number
    ) => {
      return serialize(
        {
          linkResolver,
          options,
          context,
          type,
          element,
          content,
          children,
          key: `${type}-${index}`,
          index,
        },
        customSerializers
      );
    }
  );
  return <Component {...componentProps}>{serializedChildren}</Component>;
};
