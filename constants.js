const config = {
    name: "Prowser Toolbox",
    links: [
        {
            name: "Home",
            url: "/"
        },
        {
            name:"Tools",
            url: "/toolbox",
        },
        {
            name: "Contact",
            url: "https://portfolio.prowser.nl/contact",
            target: "_blank"
        }
    ],
    tools: [
        {
            name: "Base64 Encoder/Decoder",
            description: "Encode and decode Base64 strings instantly.",
            url: "base64-encoder-decoder",
            view: "base64-encoder-decoder",
            javascript: "base64-coder.js"
        }
    ]
}
module.exports = config;