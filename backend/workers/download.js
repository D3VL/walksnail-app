const source = 'https://files.walksnail.app'
const uuidRegex = new RegExp(/(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i);

async function handleRequest(event) {
    const request = event.request;
    const cacheUrl = new URL(request.url);
    const { pathname } = cacheUrl;

    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);
    let cacheHit = false;

    // try to pull the uuid from the url, if it exists
    const uuid = pathname.split('/')[1]; // url is /e945bb7a-b010-42a7-8a89-ab698808092c/filename.ext

    if (!uuidRegex.test(uuid)) return new Response('Invalid Request', { status: 500 });

    if (!response) {
        console.log(
            `Response for request url: ${request.url} not present in cache. Fetching and caching request.`
        );

        const destinationURL = source + pathname;

        response = await fetch(destinationURL);

        response = new Response(response.body, response);

        response.headers.append('Cache-Control', 's-maxage=604800');

        event.waitUntil(cache.put(cacheKey, response.clone()));
    } else {
        console.log(`Cache hit for: ${request.url}.`);
        cacheHit = true;
    }


    // we need to notify app of the download event
    if (uuid && uuidRegex.test(uuid) && response.status === 200) {
        // we need to notify app of the download event
        fetch('https://walksnail.app/api/track-download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid,
                cacheHit: cacheHit
            }),
        });
    }


    return response;
}

addEventListener('fetch', event => {
    try {
        return event.respondWith(handleRequest(event));
    } catch (e) {
        return event.respondWith(new Response('Error thrown ' + e.message));
    }
});