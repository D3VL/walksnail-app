import { LoaderFunctionArgs } from "@remix-run/node";
import { temporaryRedirect } from "~/utils/loaderResponses.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {

    const slug = params?.slug;
    if (!slug) throw new Response(null, { status: 404 });

    return temporaryRedirect(`https://caddxfpv.com/products/${slug}?aff=166`);
}
