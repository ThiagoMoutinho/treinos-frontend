import { headers } from "next/headers";

const getBody = <T>(c: Response | Request): Promise<T> => {
    return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
    return new URL(`${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`).toString();
};

const getHeaders = async (init: HeadersInit): Promise<Headers> => {
    const requestHeaders = await headers();
    const outgoingHeaders = new Headers(init);
    outgoingHeaders.set("cookie", requestHeaders.get("cookie") ?? "");
    return outgoingHeaders;
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const requestUrl = getUrl(url);
    const requestHeaders = await getHeaders(options.headers ?? {});
    const response = await fetch(requestUrl, {
        ...options,
        headers: requestHeaders,
        credentials: "include",
    });
    const data = await getBody<T>(response);

    return { status: response.status, data, headers: response.headers } as T;
};
