const defaultResponseOptions = {
    'headers': {
        'Content-Type': 'text/xml'
    }
}
const generateUniqueID = (idLength = 6, start = '') => {
    const chars = 'abcdefghijklmnopqrstuvwxyz123456789._';
    let id = start;
    for (let i = 0; i < idLength; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

/**
 * @param body with image
 * @returns XML response with url
 */
const upload = async (body: FormData): Promise<Response> => {
    const id = generateUniqueID();
    if (!body.has("image")) throw new Error("No image found!");
    console.log('uploading...')
    await Bun.write(`./screens/${id}/img.png`, body.get("image") as FormDataEntryValue);
    console.log(`upload -> ./screens/${id}/img.png`)
    return new Response(`<response>\n<status>success</status>\n<url>http://upload.prntscr.com/get/${id}</url>\n</response>`, defaultResponseOptions);
}

const read = async (id: string): Promise<Response> => {
    if (!id) return new Response("No ID found!", defaultResponseOptions);
    const file = Bun.file(`./screens/${id}/img.png`).stream();
    console.log(`found -> ./screens/${id}/img.png`)
    return new Response(file, defaultResponseOptions);
}

Bun.serve({
    port: process.env.PORT || 80,
    async fetch(req) {
        const url = new URL(req.url);
        try {
            if (req.url.startsWith("http://upload.prntscr.com/upload/")) {
                return await upload(await req.formData());
            } else if (req.url.startsWith("http://upload.prntscr.com/get/")) {
                return new Response((await read(url.pathname.split('/get/')[1])).body)
            } else {
                return new Response("Prntscr 404");
            }
        } catch (error) {
            console.log(error)
            return new Response("Failed")
        }
    },
});
console.log('Server started')