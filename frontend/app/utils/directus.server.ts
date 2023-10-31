// @ts-nocheck -- because of the global variable
import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { CustomDirectusTypes } from '~/@types/directus';

let directus: ReturnType<typeof createDirectusClient>;

const createDirectusClient = () => {
    const client = createDirectus<CustomDirectusTypes>(process.env.DIRECTUS_HOST)
        .with(rest())
        .with(staticToken(process.env.DIRECTUS_TOKEN));
    return client;
}


if (process.env.NODE_ENV === "production") {
    directus = createDirectusClient();
} else {
    if (!global.__directus__) global.__directus__ = createDirectusClient();
    directus = global.__directus__;
}

export default directus;