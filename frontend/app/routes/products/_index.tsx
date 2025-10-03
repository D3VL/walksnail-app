import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";
import { Products } from "~/@types/directus";
import DirectusImage, { DirectusImageParams } from "~/components/DirectusImage/DirectusImage";
import { ShopifyProduct } from "~/@types/shopify";
import { useEffect, useRef, useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { name: "og:type", content: "website" },

        { title: "Walksnail Products | Walksnail Hub" },
        { property: "og:title", content: "Walksnail Products | Walksnail Hub" },
        { name: "twitter:title", content: "Walksnail Products | Walksnail Hub" },

        { name: "description", content: "Our curated list of Walksnail products." },
        { property: "og:description", content: "Our curated list of Walksnail products." },
        { name: "twitter:description", content: "Our curated list of Walksnail products." },

        { property: "og:image", content: "https://walksnail.app/assets/images/meta-image-product-list.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image-product-list.jpg" },
        { name: "twitter:card", content: "summary_large_image" },

    ];
};

interface CaddxProduct {
    created_at: Date,
    updated_at: Date,
    published_at: Date,
    images: string[],
    title: string,
    slug: string,
    tags: string[],
    is_available: boolean,
    price: {
        likely: number,
        default: number,
        min: number,
        max: number
    }
}

const caddx_product_url = 'https://caddxfpv.com/collections/walksnail-avatar-system/products.json';
const caddx_product_collections = [
    'receiver-unit',
    'walksnail-1s-3s-vtx-kit',
    'walksnail-single-antenna-version-kit',
    'walksnail-dual-antennas-version-kit',
    'walksnail-vtx-module',
    'walksnail-all-accessories',
    '19mm-camera',
    '14mm-camera'
]
let caddx_product_cache = [] as CaddxProduct[];
let caddx_product_cache_time = 0;

export const loader = async () => {

    const products = await directus.request(
        readItems('products', {
            filter: { status: { _eq: 'published' } },
            fields: [
                'name',
                'description',
                'features',
                { 'image': DirectusImageParams },
                {
                    'links': ['link', 'has_stock', {
                        'retailer': ['name', { 'logo': DirectusImageParams }]
                    }]
                }
            ]
        })
    )

    // check if cache is older than 1 hour, if so, refresh cache
    if (Date.now() - caddx_product_cache_time > 3600000) {
        // start in a new thread to keep response times snappy
        (async () => {
            try {
                caddx_product_cache_time = Date.now(); // update cache time immediately to prevent multiple refreshes at the same time

                // const { products } = await fetch(caddx_product_url).then(res => res.json()) as { products: ShopifyProduct[] };

                const products = await Promise.all(caddx_product_collections.map(async (collection) => {
                    const response = await fetch(`https://caddxfpv.com/collections/${collection}/products.json`);
                    return await response.json();
                }))
                    .then(res => res.reduce((acc, val) => acc.concat(val.products), []))
                    .then(res => res.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)) as ShopifyProduct[];
                //remove duplicates

                // if we get an error or just no data, return early
                if (!products) return;
                if (!Array.isArray(products)) return;
                if (products.length === 0) return;

                // filter down the data for what we need
                caddx_product_cache = products.map(i => {
                    const prices = i.variants.map(v => parseFloat(v.price ?? "0.00"));
                    const avg_price = prices.reduce((acc, v, i, a) => (acc + v / a.length), 0) ?? 0;
                    const likely_price = prices.reduce((prev, curr) => Math.abs(curr - avg_price) < Math.abs(prev - avg_price) ? curr : prev) ?? 0;
                    return {
                        created_at: new Date(i.created_at),
                        updated_at: new Date(i.updated_at),
                        published_at: new Date(i.published_at),
                        images: i.images.map(j => j.src) ?? [],
                        title: (i.title ?? "").replace("Walksnail", "").replace("Avatar", "").replace(" Version", "").replace("HD", "").trim(),
                        slug: i.handle ?? "",
                        tags: i.tags ?? [],
                        is_available: i.variants.some(v => v.available) ?? false,
                        price: {
                            likely: likely_price,
                            default: prices[0] ?? 0,
                            min: Math.min(...prices) ?? 0,
                            max: Math.max(...prices) ?? 0
                        }
                    }
                }) as CaddxProduct[];

            } catch (err) {
                console.error(err);
            }
        })();
    }

    return ok({
        products,
        caddxProducts: caddx_product_cache.sort(function (a, b) { return b.price.likely - a.price.likely })
    })

}


const filters = [
    {
        title: "Goggles",
        term: "goggles",
        not_term: "for",
        tag: "goggles"
    },
    {
        title: "Cameras",
        term: "camera",
        not_term: "vtx",
        tag: "camera"
    },
    {
        title: "VTXs",
        term: "vtx",
        not_term: "kit",
        tag: "vtx"
    },
    {
        title: "Kits",
        term: "kit",
        not_term: "goggles",
        tag: "kit"
    },
    {
        title: "Mini",
        term: "mini",
        not_term: null,
        tag: "mini"
    },
    {
        title: "Antennas",
        term: "antenna",
        not_term: null,
        max_price: 50,
        tag: "antennas"
    },
    {
        title: "Parts",
        term: "for",
        not_term: "antenna",
        tag: "parts"
    }
]

export default function () {

    const { products, caddxProducts } = useLoaderData<typeof loader>();

    // create ref for search input radio button
    const searchRadio = useRef<HTMLInputElement>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchInput, setSearchInput] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("all");

    const [filteredCaddxProducts, setFilteredCaddxProducts] = useState<CaddxProduct[]>(caddxProducts);

    // filter caddxProducts based on search input, use title and tags to filter on
    useEffect(() => {
        if (searchType === "search") {
            setFilteredCaddxProducts(caddxProducts.filter(p => p.title.toLowerCase().includes(searchInput.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchInput.toLowerCase()))));
        } else if (filters.some(f => f.tag === searchType)) {
            filters.forEach(filter => {
                if (searchType === filter.tag) {

                    let filtered = caddxProducts.filter(p =>
                        (p.tags.join(" ").toLowerCase().split(" ").includes(filter.term) || p.title.toLowerCase().includes(filter.term)) &&
                        !(p.tags.join(" ").toLowerCase().split(" ").includes(filter.not_term) || p.title.toLowerCase().includes(filter.not_term)))

                    if (filter.max_price) {
                        filtered = filtered.filter(p => p.price.likely <= filter.max_price!);
                    }

                    setFilteredCaddxProducts(filtered);
                }
            })
        } else {
            setFilteredCaddxProducts(caddxProducts);
        }
    }, [searchInput, searchType, caddxProducts]);


    useEffect(() => {
        if (searchParams.has("search")) {
            setSearchInput(searchParams.get("search") ?? "");
            setSearchType("search");
            searchRadio.current?.click();
        }

        if (searchParams.has("filter")) {
            setSearchType(searchParams.get("filter") ?? "all");
        }
    }, [searchParams])

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">Walksnail products</h1>
            {products.length !== 0 && <>
                <h2 className="text-2xl font-bold">Featured</h2>
                <p>Our curated list of Walksnail products.</p>
            </>}
            <small className="text-gray-500">Some links on this page are affiliate links - purchasing through these links give us a small kickback at no extra cost to you!</small>

            <div className="flex flex-col my-6 gap-6">
                {products.map((product: Products, i: number) => <>
                    <RoundedCard className="relative grid grid-cols-12 gap-4" key={i}>
                        <div className="rounded-2xl bg-gray-700 col-span-12 md:col-span-3 h-full max-h-56 md:max-h-max">
                            <DirectusImage file={product.image} className="w-full h-full object-contain" widths={[512]} />
                        </div>

                        <div className="flex flex-col col-span-12 md:col-span-9 gap-4">
                            <h2 className="text-4xl font-bold">{product.name}</h2>
                            {product.description && <p>{product.description}</p>}

                            <hr className="border-accent" />

                            <div className="grid grid-cols-2 gap-4">

                                <div className="col-span-2 md:col-span-1">
                                    <h3 className="text-xl font-bold">Features</h3>
                                    <ul className="fancy-list grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 p-2">
                                        {(product.features as string[]).map((feature: string, i: number) =>
                                            <li key={i}>{feature.replace('_', '')}</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <h3 className="text-xl font-bold">Purchase</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4">
                                        {(product.links as any[]).map((link: any, i: number) =>
                                            <a target="_blank" rel="noreferrer" href={link.link} key={i} className="border-gray-700 border-[1px] p-2 rounded-lg relative hover:scale-105 transition-transform" title={link.retailer.name}>
                                                {link.has_stock && <div className="w-1 h-1 absolute m-1 top-0 right-0 bg-success rounded-full" title="In Stock" />}
                                                <DirectusImage file={link.retailer.logo} className="w-full h-full object-contain" widths={[256]} alt={link.retailer.name} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                            </div>



                        </div>





                    </RoundedCard>
                </>)}

            </div>


            {/* Only show if we have caddxProducts */}
            {caddxProducts.length !== 0 && <div id="allProducts">
                {products.length !== 0 && <h2 className="text-2xl font-bold my-6">All products</h2>}


                {/* radio buttons to filter items */}
                <div className="flex flex-row flex-wrap gap-4 mb-4">
                    <div className="mb-4">
                        <input type="radio" defaultChecked name="filter" id="filter_all" className="sr-only peer" onChange={(e) => e.target.checked && setSearchType("all")} checked={searchType === "all"} />
                        <label htmlFor="filter_all" className="cursor-pointer p-2 rounded-lg bg-gray-200 border-gray-300 border-2 peer-checked:border-accent" >All Products</label>
                    </div>


                    {filters.map((filter, i) =>
                        <div key={i} className="mb-4">
                            <input type="radio" name="filter" id={`filter_${filter.tag}`} className="sr-only peer" onChange={(e) => e.target.checked && setSearchType(filter.tag)} checked={searchType === filter.tag} />
                            <label htmlFor={`filter_${filter.tag}`} className="cursor-pointer p-2 rounded-lg bg-gray-200 border-gray-300 border-2 peer-checked:border-accent">{filter.title}</label>
                        </div>
                    )}

                    <div className="mb-4">
                        <input type="radio" name="filter" id="filter_search" className="sr-only peer" ref={searchRadio} onChange={(e) => e.target.checked && setSearchType("search")} checked={searchType === "search"} />
                        <label htmlFor="filter_search" className="sr-only">Search</label>
                        <input type="text" placeholder="Search..." className="-mt-2 p-2 h-10 rounded-lg bg-gray-200 border-gray-300 peer-checked:border-accent border-2 focus:outline-accent placeholder-black" onClick={() => searchRadio.current?.click()} onChange={(e) => setSearchInput(e.target.value)} />
                    </div>

                </div>

                <div className="grid grid-cols-12 gap-6" >
                    {filteredCaddxProducts.map((product: CaddxProduct, i: number) => <>
                        <Link to={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-full hover:scale-105 transition-transform peer">
                            <RoundedCard className="relative grid grid-cols-12 gap-4 h-full" key={i}>
                                <div className="rounded-2xl col-span-12 max-h-40 md:max-h-52 lg:max-h-max overflow-hidden bg-white">
                                    <img src={product.images[0]} className="w-full h-full object-contain" alt={product.title} loading="lazy" />
                                </div>

                                <div className="flex flex-col col-span-12">
                                    <h3 className="text-2xl font-bold mb-0">{product.title}</h3>
                                    <div className=" justify-self-end">
                                        <p className="text-accent font-bold">—</p>
                                        <strong className="text-lg">${product.price.likely.toFixed(2)}</strong>
                                    </div>
                                </div>

                                <svg xmlns="http://www.w3.org/2000/svg" height="30" version="1.1" viewBox="0 0 24 18" className=" absolute bottom-6 right-6 stroke-white stroke-2 ">
                                    <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                </svg>
                            </RoundedCard>
                        </Link>
                    </>)}
                </div>

            </div>}

        </div >
    );
}
