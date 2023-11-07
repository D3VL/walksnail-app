import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import DonateCTA from "~/components/DonateCTA/DonateCTA";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import directus from "~/utils/directus.server";
import { readItems, createItem, updateItem } from "@directus/sdk";
import ChangelogItem from "~/components/ChangelogItem/ChangelogItem";
import { FirmwareChanges, FirmwareDownloads } from "~/@types/directus";
import FirmwareTag from "~/components/FirmwareTag/FirmwareTag";

import { loader } from "~/routes/api/firmware.$tag"
export { loader } from "~/routes/api/firmware.$tag"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const { release } = data;
    return [
        { title: `Firmware Release ${release.tag} | Walksnail Hub` },
        { name: "description", content: `Download Walksnail firmware version ${release.tag}.` },
        { property: "og:title", content: `Firmware Release ${release.tag} | Walksnail Hub` },
        { name: "twitter:title", content: `Firmware Release ${release.tag} | Walksnail Hub` },
        { property: "og:description", content: `Download Walksnail firmware version ${release.tag}.` },
        { name: "twitter:description", content: `Download Walksnail firmware version ${release.tag}.` },
        { property: "og:image", content: `https://workers.walksnail.app/meta-image-render?tag=${release.tag}` },
        { name: "twitter:image", content: `https://workers.walksnail.app/meta-image-render?tag=${release.tag}` },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:type", content: "website" }
    ];
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const tag = params.tag;
    if (!tag) throw new Response(null, { status: 404 });

    const firmwares = await directus.request(
        readItems('firmware', {
            filter: { tag: { _eq: tag } },
            limit: 1,
            fields: ['id']
        })
    );

    if (!firmwares.length) throw new Response(null, { status: 404 });
    const firmware = firmwares[0];

    // get the body of the request, we're looking for a form submission
    const body = await request.formData();
    const type = body.get("type");

    if (!type) return new Response("No type found!", { status: 400 });

    if (type === "poll") {
        const rating = body.get("rating");
        if (!rating) return new Response("No rating found!", { status: 400 });
        const ratingParsed = parseInt(rating as string) as 1 | 2 | 3 | 4 | 5;
        if (!ratingParsed) return new Response("Invalid rating!", { status: 400 });
        if (ratingParsed < 1 || ratingParsed > 5) return new Response("Invalid rating!", { status: 400 });

        // check if this ip has already voted on this firmware
        const ip = request.headers.get("cf-connecting-ip") ?? 'noipfound';
        const hasVoted = await directus.request(
            readItems('firmware_votes', {
                filter: {
                    ip_hash: { _eq: ip },
                    firmware_id: { _eq: firmware.id }
                },
                fields: ['id'],
                limit: 1
            })
        );

        if (hasVoted.length) {
            // we'll update the vote instead
            await directus.request(
                updateItem('firmware_votes', hasVoted[0].id, {
                    value: ratingParsed
                })
            )
        } else {
            // new vote
            await directus.request(
                createItem('firmware_votes', {
                    firmware_id: firmware.id,
                    ip_hash: ip,
                    value: ratingParsed
                })
            )
        }

        return new Response(null, { status: 200 });
    }

    return new Response("Invalid type!", { status: 400 });
}

const downloadTypeMap = {
    sky: {
        name: 'VTX',
        icon: '/assets/images/vtx.svg'
    },
    goggles_v1: {
        name: 'Goggles V1',
        icon: '/assets/images/goggles-1.svg'
    },
    goggles_x: {
        name: 'Goggles X',
        icon: '/assets/images/goggles-x.svg'
    },
    vrx: {
        name: 'VRX',
        icon: '/assets/images/vrx.svg'
    },
    reconhd: {
        name: 'Recon HD',
        icon: '/assets/images/reconhd.svg'
    },
    miscellaneous: {
        name: 'Miscellaneous',
        icon: null
    }
}

const DownloadCard = (download: FirmwareDownloads) => {
    const type = downloadTypeMap[download.model as keyof typeof downloadTypeMap];
    if (!type) return null;
    if (!download.file || typeof download.file === 'string') return null;

    return (
        <RoundedCard className="flex flex-col gap-4 relative ">
            {type.icon && <img src={type.icon} alt="" className="absolute top-6 right-6 h-6" />}
            <h4 className="text-lg font-bold">{download.name ?? type.name}</h4>
            <a className="btn btn-sm w-full" href={`https://download.walksnail.app/${download.file.id}/${download.file.filename_download}?download`} download={true}>Download</a>
        </RoundedCard>
    )
}

export default function () {

    const {
        release,
        totalVotes,
        votes
    } = useLoaderData<typeof loader>();
    if (!release || !votes) throw new Error("No page data found!");

    return (
        <div className="container md:px-6 mt-6">

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-8 ">

                    <h1 className="text-7xl font-bold mb-4">{release.tag}</h1>

                    <div className="flex gap-1  mb-2">
                        {release.tags.map((tag: string, i: number) =>
                            <FirmwareTag key={i} type={tag as any} />
                        )}
                    </div>

                    <span><strong>Released:</strong> {new Date(release.release_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>

                    <p>{release.description}</p>

                    <h3 className="text-2xl font-bold mt-6 mb-4">What's new?</h3>
                    <RoundedCard className="relative" bg="bg-gray-700">
                        {/* <div className="rounded-2xl bg-gray-700 px-3 py-2"> */}
                        <ul className="space-y-1">
                            {release.changes.map((change: FirmwareChanges, i: number) =>
                                <li><ChangelogItem key={i} type={change.type as any} description={change.description} /></li>
                            )}
                        </ul>
                        {/* </div> */}
                    </RoundedCard>


                    <h3 className="text-2xl font-bold mt-6 mb-4">Downloads</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {release.downloads.map((download: any, i: number) =>
                            <DownloadCard key={i} {...download} />
                        )}
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
                    <RoundedCard className="flex flex-col text-center relative" bg="bg-accent">
                        <img src="/assets/images/blobs-transparent.gif" alt="blobs" className=" absolute top-6 right-6 invert h-4" />
                        <span className="text-6xl font-bold">{
                            release.downloads.reduce((acc: number, curr: any) => acc + curr.logs_count, 0).toLocaleString('en-GB')
                        }</span>
                        <span className="text-xl">Total downloads</span>
                    </RoundedCard>

                    <RoundedCard className="flex flex-col gap-4">
                        <span className="text-xl text-center">How do you rate this firmware?</span>
                        <div className="flex gap-2 justify-center text-4xl lg:text-5xl">
                            <Form reloadDocument method="post" className="flex gap-2">
                                <input type="hidden" name="type" value="poll" />
                                <button className="hover:scale-110 transition-transform active:scale-90" type="submit" value={1} name="rating">😤</button>
                                <button className="hover:scale-110 transition-transform active:scale-90" type="submit" value={2} name="rating">😒</button>
                                <button className="hover:scale-110 transition-transform active:scale-90" type="submit" value={3} name="rating">🙂</button>
                                <button className="hover:scale-110 transition-transform active:scale-90" type="submit" value={4} name="rating">😀</button>
                                <button className="hover:scale-110 transition-transform active:scale-90" type="submit" value={5} name="rating">🔥</button>
                            </Form>
                        </div>

                        <div className="flex flex-col">
                            <span className="w-full flex items-center gap-4">🔥 <progress className="progress progress-accent bg-gray-500 w-full" value={((votes['5'] ?? 0) / totalVotes) * 100} max="100"></progress></span>
                            <span className="w-full flex items-center gap-4">😀 <progress className="progress progress-accent bg-gray-500 w-full" value={((votes['4'] ?? 0) / totalVotes) * 100} max="100"></progress></span>
                            <span className="w-full flex items-center gap-4">🙂 <progress className="progress progress-accent bg-gray-500 w-full" value={((votes['3'] ?? 0) / totalVotes) * 100} max="100"></progress></span>
                            <span className="w-full flex items-center gap-4">😒 <progress className="progress progress-accent bg-gray-500 w-full" value={((votes['2'] ?? 0) / totalVotes) * 100} max="100"></progress></span>
                            <span className="w-full flex items-center gap-4">😤 <progress className="progress progress-accent bg-gray-500 w-full" value={((votes['1'] ?? 0) / totalVotes) * 100} max="100"></progress></span>

                            <span className="text-xs text-gray-300">Based on {totalVotes.toLocaleString('en-GB')} votes</span>
                        </div>
                    </RoundedCard>
                    <DonateCTA />
                </div>
            </div>
        </div>

    )
}