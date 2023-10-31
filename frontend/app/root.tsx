import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import tailwind from "./styles/tailwind.css";


import NavBar from "./components/NavBar";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: tailwind },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <link rel="icon" href="/assets/images/favicon-responsive.svg" sizes="any" type="image/svg+xml" />
                <meta name="keywords" content="Avatar FPV, Fatshark FPV Dominator, WalkSnail, WalkSnail Update, FatShark Update, Avatar Update" />
                <meta name="twitter:creator" content="@d3vlsoftware" />
                <meta name="language" content="English" />
                <meta name="author" content="D3VL LTD" />
                <meta name="robots" content="index, follow" />
            </head>
            <body className="px-6 bg-gray-200 min-h-screen">
                <NavBar />
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <footer className="text-center w-full mt-12 pb-4">
                    <span className=" text-gray-400">
                        walksnail.app<br />
                        A <a className="text-accent" href="https://d3vl.com">D3VL</a> project
                    </span>
                    <br />
                    <small className="text-gray-400 text-xs">
                        walksnail.app is not affiliated with Walksnail.
                    </small>
                </footer>
            </body>
        </html>
    );
}
