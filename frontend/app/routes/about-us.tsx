import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "About Us | Walksnail Hub" },
        { name: "description", content: "About walksnail.app, a website crafted by D3VL for the Walksnail FPV community." },
    ];
};


export default function () {

    return (
        <div className="container md:px-6">

            <h1 className="text-3xl font-bold my-6">About walksnail.app</h1>
            <div className="flex flex-col my-6 gap-6 max-w-3xl">
                <p>
                    Welcome to walksnail.app, a website born out of passion and dedication to serve the FPV community, crafted by the dedicated team at D3VL for the entire FPV community.
                </p>

                <p>
                    Our journey began as a simple website, initially residing on avatar-firmware.d3vl.com. Its sole purpose, to offer an organized and easily accessible archive of Walksnail firmware releases.
                    The website was created in response to the lack of a dedicated resource for Walksnail firmware releases and the difficulty of finding the latest firmware for your Walksnail products.
                </p>

                <p>
                    For a significant period, we held back from making changes to the original firmware release website, hoping that Walksnail might eventually step up and establish its own platform.
                    However, after more than a year passed without any such action from them, we decided the FPV community deserved better, and it was time to take the initiative.
                </p>

                <p>
                    We have exciting plans to further enrich your FPV experience by adding numerous features to this website in the near future.
                    We envision walksnail.app becoming an all-encompassing hub, where you can find firmware releases, tutorials, special offers, dedicated tools, and more.
                    walksnail.app will be your go-to destination for all things related to Walksnail.
                </p>

                <p>
                    We believe in the power of community and welcome your involvement.
                    If you have suggestions, ideas, or if you'd like to contribute to our mission, please don't hesitate to reach out.
                    Together, we can create a vibrant and robust resource for the FPV community.
                </p>

                <p>
                    Thankyou for visiting walksnail.app and for your continued support. <br />
                    - The D3VL Team
                </p>

            </div>
        </div>
    );
}
