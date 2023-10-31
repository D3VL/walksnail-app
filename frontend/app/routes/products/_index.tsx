import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";
import { Products } from "~/@types/directus";
import DirectusImage, { DirectusImageParams } from "~/components/DirectusImage/DirectusImage";

export const meta: MetaFunction = () => {
    return [
        { title: "Walksnail Products | Walksnail Hub" },
        { name: "description", content: "Our curated list of Walksnail products." },
        { name: "og:image", content: "https://walksnail.app/assets/images/meta-image-product-list.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image-product-list.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:type", content: "website" }
    ];
};

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

    return ok({
        products
    })
}

export default function () {

    const { products } = useLoaderData<typeof loader>();

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">Walksnail products</h1>
            <p>Our curated list of Walksnail products.</p>
            <small className=" text-gray-500">Some purchase links on this page are affiliate links - purchasing through these links give us a small kickback at no extra cost to you!</small>

            <div className="flex flex-col my-6 gap-6">
                {products.map((product: Products, i: number) => <>
                    <RoundedCard className="relative grid grid-cols-12 gap-4">
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
                                            <li key={i}>{feature}</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <h3 className="text-xl font-bold">Purchase links</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 p-2">
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

        </div >
    );
}
