import { notFound } from "~/utils/loaderResponses.server"

export const loader = () => {
    return notFound({
        message: "This route does not exist.",
        status: 404
    }, { status: 404 });
}