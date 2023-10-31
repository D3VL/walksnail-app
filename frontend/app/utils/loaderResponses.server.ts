import * as runtime from '../@types/runtime';
import cleanLoaderResponse from './cleanLoaderResponse';


export const json = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 200, ...responseInit })
export const ok = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 200, ...responseInit })
export const notFound = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 404, ...responseInit })
export const unauthorized = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 401, ...responseInit })
export const forbidden = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 403, ...responseInit })
export const badRequest = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 400, ...responseInit })
export const error = (data: any, responseInit: ResponseInit = {}) => runtime.json(cleanLoaderResponse(data), { status: 500, ...responseInit })

export const redirect = (to: string, responseInit: ResponseInit = {}) => runtime.redirect(to, { status: 302, ...responseInit })
export const permanentRedirect = (to: string, responseInit: ResponseInit = {}) => runtime.redirect(to, { status: 301, ...responseInit })
export const temporaryRedirect = (to: string, responseInit: ResponseInit = {}) => runtime.redirect(to, { status: 307, ...responseInit })

export const text = (data: string) => cleanLoaderResponse(data)
export const html = (data: string) => cleanLoaderResponse(data)
export const raw = (data: string) => cleanLoaderResponse(data) 
