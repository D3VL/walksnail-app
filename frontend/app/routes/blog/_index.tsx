import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import RoundedCard from "~/components/RoundedCard/RoundedCard";
import directus from "~/utils/directus.server";
import { readItems } from "@directus/sdk";
import DirectusImage, { DirectusImageParams } from "~/components/DirectusImage/DirectusImage";
import { ok } from "~/utils/loaderResponses.server";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "Blog posts | Walksnail Hub" },
        { name: "description", content: "Read our latest blog posts, tutorials and more." },
        { property: "og:image", content: "https://walksnail.app/assets/images/meta-image-blog-posts.jpg" },
        { name: "twitter:image", content: "https://walksnail.app/assets/images/meta-image-blog-posts.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:type", content: "website" }
    ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {

    const posts = await directus.request(
        readItems('blog', {
            filter: {
                status: { _eq: 'published' }
            },
            limit: 1,
            fields: [
                'slug',
                'title',
                'date_created',
                'excerpt',
                { 'image': DirectusImageParams }
            ]
        })
    );

    return ok({
        posts
    })
}




export default function () {

    const { posts } = useLoaderData<typeof loader>();

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">Blog posts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: typeof posts[0], i: number) =>
                    <Link to={`/blog/${post.slug}`} key={i}>
                        <RoundedCard className="group">
                            <div className="rounded-2xl bg-gray-700  col-span-12 md:col-span-3 h-32 mb-3 relative overflow-hidden">
                                {Math.random() < 0.05 && <img src="/assets/images/walking-snail-small-min.png" alt="walking snail" className="w-24 absolute -bottom-6 -right-6 z-10" />}
                                <DirectusImage file={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" widths={[512]} />
                            </div>

                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-accent font-bold">—</p>
                            <p className="text-gray-200 mb-2">
                                {post.excerpt}
                            </p>

                            <span className="text-gray-400 font-bold">{new Date(post.date_created).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </RoundedCard>
                    </Link>
                )}

                <RoundedCard bg="bg-gray-700" className="flex flex-col justify-center items-center">
                    <p className="text- text-center">
                        If you have an idea for a blog post, or would like to write for us. Please get in touch!
                    </p>
                    <a className="text-accent" href="mailto:walksnail.app@d3vl.com">walksnail.app@d3vl.com</a>
                </RoundedCard>

            </div>



        </div>
    );
}
