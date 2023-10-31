import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import { ok } from "~/utils/loaderResponses.server";

export const loader = async () => {
    const releases = await directus.request(
        readItems('firmware', {
            filter: { published: { _eq: true } },
            sort: ['-release_date'],
            fields: [
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