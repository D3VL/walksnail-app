import { Link, NavLink, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";

const nav = [
    ["Home", "/"],
    ["Firmware", "/firmware"],
    ["Products", "/products"],
    ["Blog", "/blog"],
    ["About", "/about-us"],
]

export default function () {
    const remixNavigation = useNavigation();

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [remixNavigation.state]);

    const NavItems = <>
        {nav.map(([name, url]) => (
            <li key={name}>
                <NavLink className={({ isActive }) => (isActive ? "underline-active " : "") + "underline-hover"} to={url}>{name}</NavLink>
            </li>
        ))}
    </>

    return (
        <>
            <div className="container relative py-4 z-50">
                <nav className="flex justify-between items-center h-16 p-6 bg-black text-white rounded-2xl top-5 w-full sticky" role="navigation">
                    <Link to="/">
                        <div className="flex gap-4 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 19 19" >
                                <g>
                                    <rect width={7} height={10} x={0} y={0} ry={2} style={{ fill: "#fff" }} />
                                    <rect width={7} height={6} x={0} y={12} ry={2} style={{ fill: "#fff" }} />
                                    <rect width={9} height={10} x={9} y={8} ry={2} style={{ fill: "#fff" }} />
                                    <rect width={9} height={6} x={9} y={0} ry={2} style={{ fill: "#ff3e3e" }} />
                                </g>
                            </svg>
                            <span className="text-2xl font-bold">Walksnail Hub</span>
                        </div>
                    </Link>

                    <ul className="gap-4 hidden md:flex">
                        {NavItems}
                    </ul>

                    <details className="dropdown md:hidden relative" open={isMobileNavOpen} onClick={(e) => { e.preventDefault(); setIsMobileNavOpen(!isMobileNavOpen) }}>
                        <summary className="flex flex-col gap-1.5 w-12 cursor-pointer p-2 border-[1px] border-gray-700 rounded-lg"  >
                            <div className="border-accent border-b-2" />
                            <div className="border-accent border-b-2" />
                            <div className="border-accent border-b-2" />
                        </summary>
                        <ul className="p-4 bg-gray-800 rounded-box right-0 top-10 absolute grid gap-6 ">
                            {NavItems}
                        </ul>
                    </details>

                </nav>
            </div>
        </>
    )
}