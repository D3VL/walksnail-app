import { createItem, readItems } from "@directus/sdk";
import { ActionFunctionArgs } from "@remix-run/node";
import directus from "~/utils/directus.server";
import { badRequest, ok } from "~/utils/loaderResponses.server";

const uuidRegex = new RegExp(/(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i);

export const loader = async () => {
    return badRequest('Invalid request');
}

export const action = async ({ request }: ActionFunctionArgs) => {

    try {
        // we need to get the POST JSON body
        const body = await request.json();
        console.log(body);

        if (!body.uuid) return badRequest('Invalid request');

        // ensure uuid is uuidlike
        if (!uuidRegex.test(body.uuid)) return badRequest('Invalid request');


        if (!body.cacheHit) body.cacheHit = false;

        // the body contains uuid, and cacheHit -- first find all firmware_downloads with the file as uuid
        const downloads = await directus.request(
            readItems('firmware_downloads', {
                fields: ['id'],
                filter: { file: body.uuid },
                limit: 5 // just in case
            })
        );

        for (const download of downloads) {
            // 99% of the time, this will only be 1 item, but we'll loop through all of them just in case
            // increment the download count
            await directus.request(
                createItem('firmware_downloads_log', {
                    date_created: new Date().toISOString(),
                    firmware_downloads_id: download.id,
                    cache_hit: body.cacheHit ? true : false
                })
            )
        }

        return ok('success');

    } catch (error) {
        console.error(error);
        return badRequest('Invalid request body');
    }
}