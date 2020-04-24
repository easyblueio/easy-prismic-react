import { Fragment, ReactElement } from 'react';
import { renderRichText, SerializeOptions, SerializeParams, TResolver } from './html';
import { ElementTypes, PrismicElement, PrismicLink, SearchResponse } from '../typings/prismic';
import serializers, { url } from './serializers';
import ResolvedApi, { QueryOptions } from 'prismic-javascript/d.ts/ResolvedApi';
import Prismic from 'prismic-javascript';

export type TCustomSerializers = Partial<Record<ElementTypes, (params: SerializeParams) => any>>
export interface SerializerSetupParams {
    linkResolver: TResolver;
    customSerializers?: TCustomSerializers;
}

export class PrismicHTMLSerializer {
    private params: SerializerSetupParams;
    public static serializers = serializers;

    constructor(params: SerializerSetupParams) {
        if (!params || !params.linkResolver) {
            throw new Error('linkResolver is required.');
        }
        this.params = params;
    }

    public renderRichText(richText: PrismicElement[], Component: any = Fragment, componentProps = {}, options: SerializeOptions = {}, context?: any): ReactElement {
        return renderRichText(
            this.params.linkResolver,
            this.params.customSerializers,
            richText,
            Component,
            componentProps,
            options,
            context
        );
    }

    public getURL(prismicLink: PrismicLink): string {
        return url(this.params.linkResolver, prismicLink);
    }
}

export interface WrapperSetupParams {
    endpoint: string;
    language?: string;
}

export class PrismicAPIWrapper<TContentTypes> {
    private params: WrapperSetupParams;
    private api: ResolvedApi;


    constructor(params: WrapperSetupParams) {
        if (!params || !params.endpoint) {
            throw new Error('Prismic endpoint needs to be set.');
        }
        this.params = params;
    }

    public async initAPI(req: any): Promise<ResolvedApi> {
        const api  = await Prismic.getApi(this.params.endpoint, { req });
        this.api = api;
        return api;
    }

    public async getContent<T>(req: any, query: string[], queryOptions: QueryOptions = {}): Promise<SearchResponse<T>> {
        await this.initAPI(req);
        const response: any = await this.api.query(query, { ...queryOptions, lang: this.params.language || '*' });
        if (response?.results?.[0]) {
            return response;
        }
        throw new Error(`No results found for query : ${JSON.stringify(query)} with options : ${JSON.stringify(queryOptions)}`);
    }

    public getContentByType(type: TContentTypes): string[] {
        return [
            Prismic.Predicates.at('document.type', (type as unknown as string))
        ];
    }

    public getContentByUID(page: TContentTypes, uid: string): string[] {
        return [
            Prismic.Predicates.at(`my.${page}.uid`, uid)
        ];
    }
}
