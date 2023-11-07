import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import wysiwygRender from "~/utils/wysiwygRender";
import { readItems } from "@directus/sdk";
import directus from "~/utils/directus.server";
import { ok } from "~/utils/loaderResponses.server";
import { useLoaderData } from "@remix-run/react";
import DirectusImage, { DirectusImageParams } from "~/components/DirectusImage/DirectusImage";

export const loader = async ({ params }: LoaderFunctionArgs) => {

    const slug = params?.slug;
    if (!slug) throw new Response(null, { status: 404 });

    const post = await directus.request(
        readItems('blog', {
            filter: {
                slug: { _eq: slug },
                status: { _eq: 'published' }
            },
            limit: 1,
            fields: [
                'title',
                'content',
                'date_created',
                'excerpt',
                { 'image': DirectusImageParams }
            ]
        })
    );

    if (!post.length) throw new Response(null, { status: 404 });



    return ok({
        post: post[0]
    })
}


export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const { post } = data;
    return [
        { title: post.title + " | Walksnail Hub Blog" },
        { name: "description", content: post.excerpt },
        { property: "og:image", content: "https://walksnail.app/assets/images/meta-image-blog-posts.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image-blog-posts.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:type", content: "website" }
    ];
};

export default function () {

    const { post } = useLoaderData<typeof loader>();

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">{post.title}</h1>
            <hr className="border-gray-300 mb-6" />

            <div className="prose max-w-3xl">

                <DirectusImage file={post.image} className="w-full h-96 object-cover my-3 rounded-3xl" widths={[1024]} />

                {wysiwygRender(post.content)}
            </div>

        </div>
    );
}
