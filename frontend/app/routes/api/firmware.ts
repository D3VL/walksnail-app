import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // const url = new URL(request.url);
    // const system = url.searchParams.get('system');

    const releases = await directus.request(
        readItems('firmware', {
            filter: {
                published: { _eq: true },
                // ...(system ? { system: { _eq: system } } : {})
            },
            sort: ['-release_date'],
            fields: [
                'system',
                'tag',
                'tags',
                'release_date',
                'description',
                {
                    'changes': [
                        'type',
                        'description'
                    ]
                }
            ]
        })
    )

    return ok({ releases });
}