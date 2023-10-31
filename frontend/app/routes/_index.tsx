import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import DonateCTA from "~/components/DonateCTA/DonateCTA";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Walksnail Hub" },
        { name: "description", content: "Latest firmware releases, tools, special offers and more." },
        { name: "og:image", content: "https://walksnail.app/assets/images/meta-image.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:type", content: "website" }
    ];
};

export const loader = async () => {
    const [
        latestStableFirmware,
        latestBlogPost
    ] = await Promise.all([
        directus.request(
            readItems('firmware', {
                filter: {
                    published: { _eq: true },
                    tags: { _contains: 'Stable' }
                },
                sort: ['-release_date'],
                limit: 1,
                fields: ['tag', 'release_date']
            })
        ),
        directus.request(
            readItems('blog', {
                filter: {
                    status: { _eq: 'published' }
                },
                sort: ['-date_created'],
                limit: 1,
                fields: ['slug', 'title', 'date_created']
            })
        )
    ])

    return ok({
        latestStableFirmware: latestStableFirmware[0],
        latestBlogPost: latestBlogPost[0]
    });
}

export default function () {

    const {
        latestStableFirmware,
        latestBlogPost
    } = useLoaderData<typeof loader>();

    return (
        <div className="container">

            <div className="grid grid-cols-2 gap-8 py-32">
                <div className="flex justify-center flex-col gap-4 px-2 md:px-12 col-span-2 lg:col-span-1">
                    <h1 className="text-4xl lg:text-6xl font-bold">Welcome to <br />walksnail.app</h1>
                    <p className="text-xl">Your central hub for all things walksnail.</p>
                    <p>
                        We're all about enhancing your FPV experience. Whether you're a seasoned pro or just starting out, we've got you covered with the latest firmware updates and awesome guest blogs showcasing Walksnail.
                    </p>
                    <Link to="/about-us" className="bg-accent text-white font-bold uppercase px-6 py-2 rounded-xl text-center w-fit">About us</Link>
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2 lg:col-span-1 mt-20 lg:mt-0">
                    <div className="flex flex-col col-span-2 md:col-span-1 gap-4">
                        <Link to={`/firmware/${latestStableFirmware.tag}`}>
                            <RoundedCard className="hover:rotate-1 hover:scale-105 transition-transform">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-5xl font-bold">{latestStableFirmware.tag}</h3>
                                    <p className="text-accent font-bold">—</p>
                                    <span className="uppercase font-bold">Latest Firmware</span>
                                    <span className="text-xs text-gray-300 font-bold">{new Date(latestStableFirmware.release_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <div className="h-12"></div>
                                    <svg xmlns="http://www.w3.org/2000/svg" height={40} version="1.1" viewBox="0 0 24 18" className=" stroke-white stroke-2 self-end">
                                        <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                    </svg>
                                </div>
                            </RoundedCard>
                        </Link>

                        <Link to="/products">

                            <RoundedCard className="hover:rotate-1 hover:scale-105 transition-transform">
                                <div className="flex flex-col relative justify-between h-full">

                                    <h3 className="text-3xl font-bold uppercase">Walksnail Products</h3>
                                    <picture>
                                        <source srcSet="/assets/images/goggles-x-360.webp" type="image/webp" />
                                        <source srcSet="/assets/images/goggles-x-360-op.gif" type="image/gif" />
                                        <img src="/assets/images/goggles-x-360-op.gif" alt="Goggles X" className="absolute h-full w-full object-contain top-4" />
                                    </picture>
                                    <div className="h-40"></div>
                                    <svg xmlns="http://www.w3.org/2000/svg" height={40} version="1.1" viewBox="0 0 24 18" className=" stroke-white stroke-2 self-end">
                                        <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                    </svg>
                                </div>
                            </RoundedCard>
                        </Link>
                    </div>

                    <div className="flex flex-col  col-span-2 md:col-span-1 gap-4">
                        <Link to="/firmware">

                            <RoundedCard bg="bg-accent" className="hover:rotate-1 hover:scale-105 transition-transform relative mt-20 md:mt-0">
                                <img src="/assets/images/walking-snail-small-min.png" alt="walking snail" className="w-24 absolute -top-20 right-6" />

                                <div className="flex flex-col gap-2 relative">
                                    <h3 className="text-2xl md:text-3xl font-bold uppercase">All<br />Firmware</h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" height={40} version="1.1" viewBox="0 0 24 18" className=" stroke-white stroke-2 self-end fill-transparent absolute top-auto lg:-top-2 xl:top-auto bottom-0">
                                        <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                    </svg>
                                </div>
                            </RoundedCard>
                        </Link>
                        <Link to={`/blog/${latestBlogPost.slug}`} className=" h-full">

                            <RoundedCard className="hover:rotate-1 hover:scale-105 transition-transform h-full" >
                                <div className="flex flex-col gap-2 justify-between h-full">
                                    <div className="flex flex-col gap-2">
                                        <h3 className=" font-bold uppercase">Blog Post</h3>
                                        <p className="text-accent font-bold">—</p>
                                        <span className="text-3xl font-bold uppercase">
                                            {latestBlogPost.title}
                                        </span>
                                        <span className="text-xs text-gray-300 font-bold">{new Date(latestBlogPost.date_created).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" height={40} version="1.1" viewBox="0 0 24 18" className=" stroke-white stroke-2 self-end">
                                        <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                    </svg>
                                </div>
                            </RoundedCard>
                        </Link>
                    </div>


                    <div className="col-span-2">
                        <div className="hover:scale-105 transition-transform">
                            <DonateCTA />
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}
