import ApiSearchResponse from 'prismic-javascript/d.ts/ApiSearchResponse';

export interface PrismicImage {
    url: string;
    dimensions?: { width: number; height: number };
    alt?: string;
    copyright?: string;
}

export enum ElementTypes {
    Heading1 = 'heading1',
    Heading2 = 'heading2',
    Heading3 = 'heading3',
    Heading4 = 'heading4',
    Heading5 = 'heading5',
    Heading6 = 'heading6',
    Paragraph = 'paragraph',
    Preformatted = 'preformatted',
    Strong = 'strong',
    Em = 'em',
    ListItem = 'list-item',
    OListItem = 'o-list-item',
    GroupListItem = 'group-list-item',
    GroupOListItem = 'group-o-list-item',
    Image = 'image',
    Embed = 'embed',
    Hyperlink = 'hyperlink',
    Label = 'label',
    Span = 'span'
}

export interface PrismicElement {
    uid: string;
    type: ElementTypes;
    text?: string;
    spans?: any[];
    start?: number;
    end?: number;
}

export interface PrismicLink {
    uid?: string;
    link_type?: string;
    url: string;
    type?: string;
    target?: string;
}

export interface PrismicDocument<T> {
    id: string;
    uid?: string;
    type: string;
    href: string;
    tags: string[];
    slugs: string[];
    lang?: string;
    alternate_languages: string[];
    first_publication_date: string | null;
    last_publication_date: string | null;
    data: T;
}

export interface SearchResponse<T> extends Omit<ApiSearchResponse, 'results'> {
    results: PrismicDocument<T>[];
}
