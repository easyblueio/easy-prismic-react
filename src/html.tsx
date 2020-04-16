// import PrismicRichText, { Elements } from 'prismic-richtext';
// import React, { Fragment, ReactNode } from 'react';
// import {
//   serializeElement,
//   serializeEmbed,
//   serializeImage,
//   serializeLabel,
//   serializeSpan,
//   serializeStandardTag
// } from './serializers';
// import {PrismicDocument, PrismicElement} from '../typings/prismic';
//
// export interface SerializeOptions {
//   removeParagraphs?: boolean;
// }
//
// export type TResolver = (doc: PrismicDocument<any>) => string;
//
// function serialize(
//   linkResolver: TResolver,
//   elements: any,
//   type: string,
//   element: PrismicElement,
//   content: string,
//   children: (string | ReactNode)[],
//   index: number,
//   options?: SerializeOptions,
//   context?: any
// ): React.ReactElement {
//   if (elements[type]) {
//     return serializeElement(type, elements[type], children, index);
//   }
//   switch (type) {
//     case Elements.heading1:
//       return serializeStandardTag('h1', element, children, index);
//     case Elements.heading2:
//       return serializeStandardTag('h2', element, children, index);
//     case Elements.heading3:
//       return serializeStandardTag('h3', element, children, index);
//     case Elements.heading4:
//       return serializeStandardTag('h4', element, children, index);
//     case Elements.heading5:
//       return serializeStandardTag('h5', element, children, index);
//     case Elements.heading6:
//       return serializeStandardTag('h6', element, children, index);
//     case Elements.paragraph:
//       return serializeStandardTag(options.removeParagraphs ? React.Fragment : 'p', element, children, index);
//     case Elements.preformatted:
//       return serializeStandardTag('pre', element, children, index);
//     case Elements.strong:
//       return serializeStandardTag('strong', element, children, index);
//     case Elements.em:
//       return serializeStandardTag('em', element, children, index);
//     case Elements.listItem:
//       return serializeStandardTag('li', element, children, index);
//     case Elements.oListItem:
//       return serializeStandardTag('li', element, children, index);
//     case Elements.list:
//       return serializeStandardTag('ul', element, children, index);
//     case Elements.oList:
//       return serializeStandardTag('ol', element, children, index);
//     case Elements.image:
//       return serializeImage(linkResolver, elements, type, element, index);
//     case Elements.embed:
//       return serializeEmbed();
//     case Elements.hyperlink:
//       // TODO : default hyperlink
//       return serializeHyperlink(element, children, index);
//     case Elements.label:
//       return serializeLabel(element, children, index);
//     case Elements.span:
//       return serializeSpan(content);
//     default:
//       return null;
//   }
// }
//
// export const renderRichText = (linkResolver, richText, Component: any = Fragment, elements = {}, serializerArgs = {}, options = {}, context?: any): React.ReactElement => {
//   if (Object.prototype.toString.call(richText) !== '[object Array]') {
//     return null;
//   }
//   const serializedChildren = PrismicRichText.serialize(
//     richText,
//     (...serializerArgs) => (serialize as any)(linkResolver, elements, ...serializerArgs, options, context)
//   );
//   return <Component {...serializerArgs}>{serializedChildren}</Component>;
// };

export {};
