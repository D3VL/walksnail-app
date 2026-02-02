import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { readItems } from "@directus/sdk"
import directus from "~/utils/directus.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const tag_redirect = params?.tag_redirect ?? '';
    if (!tag_redirect) throw new Response(null, { status: 404 });

    const data = await directus.request(
        readItems('firmware', {
            filter: {
                tag: { _eq: tag_redirect },
                published: { _eq: true },
            },
            limit: 1,
            fields: ['id', 'system', 'tag']
        })
    )

    if (!data || data.length === 0) return redirect(`/firmware`);
    if (data[0].system && data[0].tag) return redirect(`/firmware/${(data[0]?.system ?? '').toLowerCase()}/${data[0].tag}`);
    return redirect(`/firmware`);
}