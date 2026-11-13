const MAX_BODY_BYTES = 4_500_000;

function jsonResponse(status, payload) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
        }
    });
}

export async function invokeHandler(handler, request, url) {
    const headers = {};
    request.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });
    if (!headers['x-forwarded-for'] && headers['cf-connecting-ip']) {
        headers['x-forwarded-for'] = headers['cf-connecting-ip'];
    }

    const declaredLength = Number(headers['content-length'] || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return jsonResponse(413, { error: 'Request body too large.' });
    }

    const raw = Buffer.from(await request.arrayBuffer());
    if (raw.length > MAX_BODY_BYTES) {
        return jsonResponse(413, { error: 'Request body too large.' });
    }

    const responseHeaders = new Headers();
    let ended = false;
    let payload;
    const res = {
        statusCode: 200,
        setHeader(name, value) {
            responseHeaders.set(name, String(value));
        },
        getHeader(name) {
            return responseHeaders.get(name);
        },
        writeHead(status, extraHeaders) {
            this.statusCode = status;
            if (extraHeaders && typeof extraHeaders === 'object') {
                for (const [name, value] of Object.entries(extraHeaders)) {
                    responseHeaders.set(name, String(value));
                }
            }
            return this;
        },
        end(body) {
            ended = true;
            payload = body;
        }
    };

    const req = {
        method: request.method,
        url: `${url.pathname}${url.search}`,
        headers,
        query: Object.fromEntries(url.searchParams.entries()),
        rawBody: raw,
        socket: {
            remoteAddress: headers['cf-connecting-ip'] || (headers['x-forwarded-for'] || '').split(',')[0].trim()
        },
        async *[Symbol.asyncIterator]() {
            if (raw.length) yield raw;
        }
    };

    await handler(req, res);
    if (!ended) {
        return jsonResponse(500, { error: 'Handler did not complete the response.' });
    }

    const status = res.statusCode || 200;
    if (status === 204 || status === 304) {
        return new Response(null, { status, headers: responseHeaders });
    }

    let body = payload == null ? '' : payload;
    if (Buffer.isBuffer(body)) body = new Uint8Array(body);
    return new Response(body, { status, headers: responseHeaders });
}
