import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import RoundedCard from "~/components/RoundedCard/RoundedCard";


export const loader = () => {
    throw new Response(null, {
        status: 404,
        statusText: "Not Found",
    });
}


const FourOhFour = () => {
    return (
        <div className="min-h-[50vh] min-w-screen flex flex-col justify-center items-center text-center p-6">
            <RoundedCard>
                <h1 className="text-8xl font-bold">404</h1>
                <p className="text-xl">Page not found</p>
            </RoundedCard>
        </div>
    )
}

export default function () {
    return (
        <div className="container">
            <FourOhFour />
        </div >
    );
}

export const ErrorBoundary = () => {
    const error = useRouteError()
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) return <FourOhFour />
    }

    return (
        <div className="min-h-[50vh] min-w-screen flex flex-col justify-center items-center text-center p-6">
            <h1 id="h1" className="text-9xl font-light">Oops!</h1>
            <h3 className="h3 font-bold">
                Something went wrong. Please try again later.
            </h3>
        </div>
    );
}