import { PrismicAPIWrapper } from '../src';
import { PrismicElement } from '../typings/prismic';

export const ENDPOINT = 'https://easy-prismic-react.cdn.prismic.io/api/v2';
export type TContentTypes = 'blog_post' | 'not_existing_type';
export interface BlogPost {
    title: PrismicElement;
    rich_text: PrismicElement[];
}

describe('API wrapper', () => {

    it('Should instantiate', () => {
        const apiWrapper = new PrismicAPIWrapper({ endpoint: ENDPOINT });
        expect(apiWrapper).toBeInstanceOf(PrismicAPIWrapper);
    });

    it('Should fail when endpoint is missing', () => {
        expect(() => {
            // @ts-ignore
            new PrismicAPIWrapper();
        }).toThrow(new Error('Prismic endpoint needs to be set.'));
    });

    it('Should init API', async () => {
        const apiWrapper = new PrismicAPIWrapper({ endpoint: ENDPOINT });
        const api = await apiWrapper.initAPI(null);
        expect(api).toBeDefined();
    });

    it('Should throw an error when no results are found', async () => {
        try {
            const apiWrapper = new PrismicAPIWrapper<TContentTypes>({ endpoint: ENDPOINT });
            await apiWrapper.getContent<any>(null, apiWrapper.getContentByType('not_existing_type'));
        } catch (err) {
            expect(err.message).toEqual('No results found for query : ["[at(document.type, \\"not_existing_type\\")]"] with options : {}');
        }
    });

    it('Should fetch blog post by type', async () => {
        const apiWrapper = new PrismicAPIWrapper<TContentTypes>({ endpoint: ENDPOINT });
        const blogPost = await apiWrapper.getContent<BlogPost>(null, apiWrapper.getContentByType('blog_post'));
        const data = blogPost?.results[0]?.data;
        expect(data?.title).toBeDefined();
        expect(data?.rich_text).toBeDefined();
    });

    it('Should fetch blog post by UID', async () => {
        const UID = 'this-is-a-custom-uid';
        const apiWrapper = new PrismicAPIWrapper<TContentTypes>({ endpoint: ENDPOINT });
        const blogPost = await apiWrapper.getContent<BlogPost>(null, apiWrapper.getContentByUID('blog_post', UID));
        const uid = blogPost?.results[0]?.uid;
        const data = blogPost?.results[0]?.data;
        expect(uid).toEqual(UID);
        expect(data?.title).toBeDefined();
        expect(data?.rich_text).toBeDefined();
    });
});
