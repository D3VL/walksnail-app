import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import DonateCTA from "~/components/DonateCTA/DonateCTA";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import FirmwareTag from "~/components/FirmwareTag/FirmwareTag";
import ChangelogItem from "~/components/ChangelogItem/ChangelogItem";
import { FirmwareChanges } from "~/@types/directus";
import { Fragment } from 'react'

import { loader } from "~/routes/api/firmware"
export { loader } from "~/routes/api/firmware"

export const meta: MetaFunction = () => {
    return [
        { title: "All Firmware Releases | Walksnail Hub" },
        { name: "description", content: "Our archive of all Walksnail and FatShark Avatar firmware releases, including private beta releases." },
        { name: "og:image", content: "https://walksnail.app/assets/images/meta-image-firmware-list.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image-firmware-list.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:type", content: "website" }
    ];
};

export default function () {

    const { releases } = useLoaderData<typeof loader>();

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">All WalkSnail & FatShark Avatar Firmware Releases</h1>
            <p>
                Here you can find all the latest and historical firmware releases for your Walksnail products.
            </p>

            <div className="flex flex-col  my-6">


                {releases.map((release: any, i: number) => {

                    return (
                        <Fragment key={i}>
                            <section className="grid grid-cols-12 gap-4">

                                <div className="hidden lg:flex flex-col col-span-12 lg:col-span-2 items-center gap-4">
                                    <div className="w-[2px] h-12 bg-accent rounded-full"></div>
                                    <span className="font-xl uppercase font-bold">{new Date(release.release_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <div className="w-[2px] h-full bg-accent rounded-full"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-10 mb-8">
                                    <Link to={`/firmware/${release.tag}`}>
                                        <RoundedCard className="relative flex flex-col gap-1      justify-between">
                                            <svg xmlns="http://www.w3.org/2000/svg" height={40} version="1.1" viewBox="0 0 24 18" className=" absolute top-6 right-6 stroke-white stroke-2 ">
                                                <path d="M 24 9 H 0 M 24 9 C 19 9 14 5 12 0 M 24 9 C 19 9 14 13 12 18"></path>
                                            </svg>


                                            <h2 className="text-4xl font-bold">{release.tag}</h2>
                                            <span className="block lg:hidden text-gray-200 uppercase font-bold">{new Date(release.release_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}</span>

                                            <div className="flex gap-1 flex-wrap">
                                                {release.tags.map((tag: string, i: number) =>
                                                    <FirmwareTag key={i} type={tag as any} />
                                                )}
                                            </div>


                                            <p>{release.description}</p>

                                            <h3 className="font-bold mt-2">What's new?</h3>
                                            <div className="rounded-2xl bg-gray-700 px-3 py-2">
                                                <ul className=" space-y-1">
                                                    {release.changes.map((change: FirmwareChanges, i: number) =>
                                                        <li><ChangelogItem key={i} type={change.type as any} description={change.description} /></li>
                                                    )}
                                                </ul>
                                            </div>

                                        </RoundedCard>
                                    </Link>
                                </div>
                            </section>


                            {(i % 10 === 0) && <>
                                <section className="grid grid-cols-12 gap-4">
                                    <div className="hidden lg:flex  flex-col col-span-12 lg:col-span-2 items-center">
                                        <div className="w-[2px] h-full bg-accent rounded-full"></div>
                                    </div>
                                    <div className="col-span-12 lg:col-span-10 mb-8">
                                        <DonateCTA />
                                    </div>
                                </section>
                            </>}
                        </Fragment>
                    )

                })}







            </div>

        </div >
    );
}
