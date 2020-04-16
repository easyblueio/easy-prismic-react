import React, { createElement } from 'react';

function url(linkResolver, link): string {
  if (link.link_type === 'Document') {
    return linkResolver(link);
  } else {
    return link.url;
  }
}

function propsWithUniqueKey(props, key): Record<string, any> {
  return Object.assign(props || {}, { key });
}

export const serializeHyperlink = (linkResolver, element, children, key): React.ReactElement => {
  const targetAttr = element.data.target ? { target: element.data.target } : {};
  const relAttr = element.data.target ? { rel: 'noopener' } : {};
  const props = Object.assign({ href: url(linkResolver, element.data) }, targetAttr, relAttr);
  return createElement('a', propsWithUniqueKey(props, key), children);
};

export function serializeImage(linkResolver, element, index): React.ReactElement {
  const linkUrl = element.linkTo ? url(linkResolver, element.linkTo) : null;
  const linkTarget =
    element.linkTo && element.linkTo.target ? { target: element.linkTo.target } : {};
  const relAttr = linkTarget.target ? { rel: 'noopener' } : {};
  const img = createElement('img', { src: element.url, alt: element.alt || '' });

  return createElement(
    'p',
    propsWithUniqueKey({ className: [element.label || '', 'block-img'].join(' ') }, index),
    linkUrl ? createElement('a', Object.assign({ href: linkUrl }, linkTarget, relAttr), img) : img
  );
}

export function serializeSpan(content): React.ReactElement {
  if (content) {
    return content.split('\n').reduce((acc, p) => {
      if (acc.length === 0) {
        return [p];
      } else {
        const brIndex = (acc.length + 1) / 2 - 1;
        const br = createElement('br', propsWithUniqueKey({}, brIndex));
        return acc.concat([br, p]);
      }
    }, []);
  } else {
    return null;
  }
}

export function serializeLabel(element, children, key): React.ReactElement {
  const props = element.data ? Object.assign({}, { className: element.data.label }) : {};
  return createElement('span', propsWithUniqueKey(props, key), children);
}

export function serializeEmbed(): React.ReactElement {
  return null;
}

export function serializeStandardTag(tag, element, children, key): React.ReactElement {
  const props = element.label ? Object.assign({}, { className: element.label }) : {};
  return createElement(tag, propsWithUniqueKey(props, key), children);
}

export default {
  serializeHyperlink,
  serializeImage,
  serializeSpan,
  serializeLabel,
  serializeStandardTag,
};
