import parse, { domToReact } from 'html-react-parser'
import { HTMLReactParserOptions, Element } from 'html-react-parser';
import { DirectusFiles } from '~/@types/directus';
import DirectusImage from '~/components/DirectusImage';
import { Link } from '@remix-run/react';
import DonateCTA from '~/components/DonateCTA/DonateCTA';

const uuidRegex = new RegExp(/(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)/i);

const options: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element) {
            if (domNode.name === 'img') {
                // if the image has a uuid in the src, replace with a <DirectusImage /> component
                const src = domNode.attribs.src;
                const uuid = src.match(uuidRegex);
                if (uuid) {
                    // check for alt, width, height, and class
                    const alt = domNode.attribs.alt;
                    return <DirectusImage file={{
                        id: uuid[0],
                        title: alt,
                        description: alt,
                        width: null,
                        height: null,
                    } as DirectusFiles}
                        alt={alt}
                        widths={[400, 738, 1200]}
                        className="w-full max-h-96 object-cover my-1 rounded-3xl"
                    />
                } else {
                    // if not, return the img tag as is
                    return domNode;
                }
            }

            if (domNode.name === 'a') {
                // if the link is local, replace with a <Link /> component
                const href = domNode.attribs.href ?? '';

                if (href === '#donate') return <DonateCTA />
                if (href.startsWith('/')) return <Link to={href}>{domToReact(domNode.children, options)}</Link >

                // if not, return the a tag as is, adding target="_blank" and rel="noopener noreferrer"
                domNode.attribs.target = "_blank";
                domNode.attribs.rel = "noopener noreferrer";
                return domNode;

            }

            if (domNode.name === 'ol') {
                // apply class list-decimal
                return <ol className={"list-decimal ms-5 " + domNode?.attribs?.class ?? ''}>{domToReact(domNode.children, options)}</ol>
            }

            if (domNode.name === 'ul') {
                // apply class list-disc
                return <ul className={"list-disc ms-5 " + domNode?.attribs?.class ?? ''}>{domToReact(domNode.children, options)}</ul>
            }

            if (domNode.name === 'table') {
                // remove border=1 from tables
                try { delete domNode.attribs.border; } catch (e) { }
                return domNode;
            }

            if (domNode.name === 'script') return null;
            if (domNode.name === 'style') return null;
            if (domNode.name === 'noscript') return null;
        }
    }
}

export default function (html: string) {
    return parse(html, options);
}