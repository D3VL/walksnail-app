import { DirectusFiles } from "~/@types/directus";

export const DirectusImageParams: Array<keyof DirectusFiles> = [
    'id',
    'title',
    'description',
    'width',
    'height',
]

export default function ({
    file,
    width,
    height,
    alt,
    className = '',
    quality = 75,
    fit = 'cover',
    widths = [320, 640, 960, 1280, 1920],
    loading = 'lazy',
    transforms = []
}: {
    file: string | DirectusFiles | null;
    width?: number;
    height?: number;
    alt?: string;
    className?: string;
    quality?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
    widths?: number[] | [number, number][]
    loading?: 'lazy' | 'eager';
    transforms?: [string, any][];
}) {

    if (!file) return null

    // if we're given a string, assume it's the id of the file, make a fake DirectusImage object
    if (typeof file === 'string') file = {
        id: file,
        title: '',
        description: '',
        width: 0,
        height: 0,
    } as DirectusFiles

    // automatically generate the srcset for the images based on the width and height given
    const baseurl = `https://files.walksnail.app/${file.id}?fit=${fit}&quality=${quality}&transforms=${encodeURIComponent(JSON.stringify(transforms))}`
    // const baseurl = `http://localhost:8055/assets/${file.id}?fit=${fit}&quality=${quality}&transforms=${encodeURIComponent(JSON.stringify(transforms))}`

    return (
        <picture>
            <source
                type="image/avif"
                srcSet={widths.map((width) => `${baseurl}&width=${(typeof width === "object") ? width[0] : width}&format=avif ${(typeof width === "object") ? width[0] : width}w`).join(', ')}
                sizes={widths.map((width) => {
                    if (typeof width === "object") return `(max-width: ${width[1]}px) ${width[0]}px`
                    return `(max-width: ${width}px) ${width}px`
                }).join(', ')}
            />

            <source
                type="image/webp"
                srcSet={widths.map((width) => `${baseurl}&width=${(typeof width === "object") ? width[0] : width}&format=webp ${(typeof width === "object") ? width[0] : width}w`).join(', ')}
                sizes={widths.map((width) => {
                    if (typeof width === "object") return `(max-width: ${width[1]}px) ${width[0]}px`
                    return `(max-width: ${width}px) ${width}px`
                }).join(', ')}
            />

            <source
                type="image/jpeg"
                srcSet={widths.map((width) => `${baseurl}&width=${(typeof width === "object") ? width[0] : width}&format=jpg ${(typeof width === "object") ? width[0] : width}w`).join(', ')}
                sizes={widths.map((width) => {
                    if (typeof width === "object") return `(max-width: ${width[1]}px) ${width[0]}px`
                    return `(max-width: ${width}px) ${width}px`
                }).join(', ')}
            />

            <img
                width={width}
                height={height}
                className={className}
                loading={loading}
                alt={alt ?? file.description ?? file.title ?? ''}
                src={`${baseurl}&format=jpg`}
            />
        </picture>
    )
}
