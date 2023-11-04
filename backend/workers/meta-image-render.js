export default {
    async fetch(request, env) {
        const { searchParams } = new URL(request.url);
        let tag = searchParams.get("tag");
        let img;
        if (tag) {
            const url = new URL(`https://walksnail.app/firmware/${tag}/meta-image`).toString(); // normalize
            img = await env.KV_BINDING.get(url, { type: "arrayBuffer" });
            if (img === null) {

                // check the url exists and returns a 200
                const response = await fetch(url);
                if (!response.ok) return new Response("Invalid tag", { status: 400 });

                // take a screenshot
                const screenshotUrl = `https://api.screenshotone.com/take?viewport_width=1200&viewport_height=630&url=${encodeURIComponent(url)}&access_key=${env.SCREENSHOTONE_API_KEY}`;

                const screenshotResponse = await fetch(screenshotUrl);

                if (!screenshotResponse.ok) return new Response("Screenshot failed", { status: 500 });

                img = await screenshotResponse.arrayBuffer();

                // store screenshot in KV
                await env.KV_BINDING.put(url, img, {
                    expirationTtl: 31_536_000, // keep the img for 1 year
                });
            }
            return new Response(img, {
                headers: {
                    "content-type": "image/jpeg",
                },
            });
        } else {
            return new Response(
                "Please add an ?tag=1.1.1 parameter"
            );
        }
    },
};