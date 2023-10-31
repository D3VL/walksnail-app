import { LoaderFunctionArgs } from "@remix-run/node";
import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {

    const tag = params?.tag;
    if (!tag) throw new Response(null, { status: 404 });

    const data = await directus.request(
        readItems('firmware', {
            filter: {
                tag: { _eq: tag },
                published: { _eq: true }
            },
            limit: 1,
            fields: [
                'id',
                'tag',
                'tags',
                'release_date',
                'description',
                {
                    'downloads': [
                        'count(logs)', // how many times this file has been downloaded
                        'model',
                        'name',
                        {
                            'file': [
                                'filename_download',
                                'filesize',
                                'id'
                            ]
                        }
                    ]
                },
                {
                    'changes': [
                        'type',
                        'description'
                    ]
                },
                { 'votes': ['value'] }
            ]
        })
    )

    // if no data, throw 404
    if (!data || data.length === 0) throw new Response(null, { status: 404 });

    // condense the votes data
    const condensedVotes = [...(data[0]?.votes ?? [])].reduce((acc: any, curr: any) => {
        if (!acc[curr.value]) acc[curr.value] = 1;
        else acc[curr.value] += 1;
        return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const totalVotes = Object.values(condensedVotes).reduce((acc: any, curr: any) => acc + curr, 0) as number;

    data[0].votes = null; // remove the votes data from the response


    return ok({
        release: data[0],
        totalVotes,
        votes: condensedVotes
    });
}