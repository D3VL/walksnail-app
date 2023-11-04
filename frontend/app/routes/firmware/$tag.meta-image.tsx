import { useLoaderData } from "@remix-run/react";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import ChangelogItem from "~/components/ChangelogItem/ChangelogItem";
import { FirmwareChanges } from "~/@types/directus";
import FirmwareTag from "~/components/FirmwareTag/FirmwareTag";

import { loader } from "~/routes/api/firmware.$tag"
export { loader } from "~/routes/api/firmware.$tag"


export default function () {

    const {
        release,
        totalVotes,
        votes
    } = useLoaderData<typeof loader>();
    if (!release || !votes) throw new Error("No page data found!");

    return (
        <div className="container">
            <style>{` 
                nav,
                footer{
                    display:none !important
                } 

                li span {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 870px;
                }
            `}</style>

            <svg xmlns="http://www.w3.org/2000/svg" height="60" viewBox="0 0 19 19" className="absolute top-6 right-6">
                <g>
                    <rect width={7} height={10} x={0} y={0} ry={2} style={{ fill: "#000" }} />
                    <rect width={7} height={6} x={0} y={12} ry={2} style={{ fill: "#000" }} />
                    <rect width={9} height={10} x={9} y={8} ry={2} style={{ fill: "#000" }} />
                    <rect width={9} height={6} x={9} y={0} ry={2} style={{ fill: "#ff3e3e" }} />
                </g>
            </svg>

            <div className="grid grid-cols-12">
                <div className="col-span-12">

                    <span className="text-2xl font-bold uppercase text-black">Firmware Release </span>
                    <h1 className="text-8xl font-bold mb-4 text-black">{release.tag}</h1>

                    <div className="flex gap-1 mb-4">
                        {release.tags.map((tag: string, i: number) =>
                            <FirmwareTag type={tag as any} className="text-2xl me-2 font-bold p-4" />
                        )}
                    </div>

                    <RoundedCard className="relative mb-6 rounded-xl p-4" bg="bg-gray-700">
                        <img src="/assets/images/walking-snail-small-min.png" alt="walking snail" className=" w-24 absolute -top-20 right-6" />
                        <ul className="space-y-1">
                            {release.changes.slice(0, 7).map((change: FirmwareChanges, i: number) =>
                                <li className="text-3xl inline-flex">
                                    <ChangelogItem key={i} type={change.type as any} description={change.description} className="text-2xl font-bold p-4 w-52 me-6" />
                                </li>
                            )}
                        </ul>
                    </RoundedCard>
                </div>

            </div>
            <span className="text-2xl text-gray-500 absolute bottom-6 left-6">walksnail.app</span>
            <span className="text-2xl text-gray-500 absolute bottom-6 right-6">D3VL</span>
        </div>


    )
}