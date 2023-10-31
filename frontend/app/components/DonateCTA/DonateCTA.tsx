import RoundedCard from "../RoundedCard/RoundedCard";



export default function () {
    return (
        <a href="https://www.buymeacoffee.com/d3vl" target="_blank" rel="noreferrer">
            <RoundedCard className="relative me-1">
                <div className="flex flex-col gap-2 max-w-[70%] sm:max-w-[65%]">
                    <h1 className="text-2xl font-bold uppercase">Buy Us a Coffee</h1>
                    <p className="text-xs font-bold uppercase">
                        This site is independently run and maintained by D3VL.<br />If you found it useful please consider supporting us!
                    </p>
                </div>

                <div className="max-w-[40%] sm:max-w-[50%] absolute bottom-0 -right-1 bg-[#ffdd00] h-full w-56 rounded-e-[2rem] flex justify-end " style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" className="h-full relative right-6 max-w-[60%]" >
                        <path d="M390 137h-1 1zm3 24zm-3-24zm3 24 1-1-1 1zm-2-23-1-1 1 1zm-94 228-1 1 1-1zm55-11-1 1 1-1zm-6 11-1 1 1-1zm-87 3-1-1v1h1zm-9-8v-1 1z" />
                        <path d="M308 213c-12 5-25 11-43 11l-21-3 12 123c0 5 3 10 6 14 4 3 9 5 14 5a745 745 0 0 0 48 0c5 0 10-2 14-5 4-4 6-9 6-14l13-136c-6-2-11-4-18-4-11 0-20 4-31 9z" style={{ fill: "#fff" }} />
                        <path d="M207 160zm206-11-2-9c-2-9-5-16-14-19l-7-4c-3-2-3-5-4-7l-2-16-4-13c-2-6-8-9-13-11l-9-3c-14-4-28-5-42-6a359 359 0 0 0-89 8c-4 2-9 4-12 7-4 4-5 11-2 16 2 3 5 6 9 8l16 5c14 3 30 4 45 5 16 0 33 0 50-2l12-1c5-1 8-8 7-12-2-5-7-7-12-6h-3l-5 1a367 367 0 0 1-70 0l-5-1h-4a172 172 0 0 1-10-3l-1-1h1l1-1 8-2h3l6-1a351 351 0 0 1 69 0l5 1h3l11 2c6 1 13 2 15 7l2 6v3l4 18v1l-1 1-1 1h-1l-1 1h-8l-14 2-29 2h-14a491 491 0 0 1-65-4l-2-1h-4l-13-2c-5-1-11-1-15 2-4 2-8 5-10 9l-3 14c-1 5-3 10-2 15 1 10 8 18 19 20a488 488 0 0 0 155 5h3l3 2 1 3 1 2-1 10-6 58-6 61-2 17-2 17c-2 9-8 14-16 16l-24 3h-27c-10 0-22-1-29-8s-7-16-8-25l-4-34-6-62-5-41v-2c0-4-4-9-9-9s-10 4-9 9l3 30 6 62 6 53 1 10c2 19 16 29 33 32l31 2c14 0 27 0 40-2 19-3 34-16 36-36l2-18 6-57 6-63 3-28 2-4 3-2c6-1 11-3 15-7 6-7 7-15 5-24zm-208 6v1-1zm1 4zm0 1zm1 1zm186-2-8 4a561 561 0 0 1-179-3c-3-4-1-10 0-14 0-4 2-9 6-9 7-1 15 2 21 3l24 3a462 462 0 0 0 121-5c5-1 11-3 15 3 2 4 2 9 2 13l-2 5z" />
                    </svg>
                </div>

            </RoundedCard>
        </a>
    )
}