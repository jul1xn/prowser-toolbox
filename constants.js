//const { Innertube } = require('youtubei.js');
const data = require('./data');

const config = {
    name: "Prowser Toolbox",
    links: [
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Tools",
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
            javascript: "base64-coder.js",
        },
        {
            name: "URL Encoder/Decoder",
            description: "Encode and decode URL parameters instantly.",
            url: "url-encoder-decoder",
            view: "url-encoder-decoder",
            javascript: "url-coder.js",
        },
        {
            name: "Password Generator",
            description: "Create complex generated passwords.",
            url: "password-generator",
            view: "password-generator",
            javascript: "password-gen.js"
        },
        {
            name: "Temporary file upload",
            description: "Upload any file for a limited time. Usefull for transferring files very quickly.",
            url: "temp-file-upload",
            view: "temp-file-upload",
            javascript: "file-upload.js",
            css: "temp-file-upload.css",
            handler: async (req) => {
                if (!req.query.file) return {};
                else {
                    const file = await data.getFileByKey(req.query.file);
                    return {...file, url: `/api/files/${file.file_key}`, file_size_formatted: data.formatSize(file.file_size) };
                }
            }
        },
        {
            name: "URL Shortener",
            description: "Shorten any long URL with ease. Choose your own timeframe",
            url: "url-shortener",
            view: "url-shortener",
            handler: async (req) => {
                if (!req.query.url) return {};
                else {
                    const redirect = await data.getRedirect(req.query.url);
                    console.log(redirect);
                    return {...redirect, url: `/${redirect.short_key}` };
                }
            }
        },
        {
            name: "Youtube Downloader",
            description: "Download any youtube video with ease.",
            url: "youtube-downloader",
            view: "youtube-downloader",
            javascript: "yt-downloader.js",
            // handler: async (req) => {
            //     if (!req.query.url) return {};

            //     const match = req.query.url.match(
            //         /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            //     );

            //     const video_id = match ? match[1] : null;
            //     if (!video_id) return {};

            //     //temporary return fake info for ui testing
            //     const info = {
            //         basic_info: {
            //             id: 'shmjr-fOpF0',
            //             channel_id: 'UCIEse2ctw0DcyQZ68ooxW4A',
            //             title: 'Piaggio Zip 2-Takt Rebuild! - Part 1 - Fresh Parts',
            //             duration: 3073,
            //             keywords: undefined,
            //             is_owner_viewing: false,
            //             short_description: 'In deze serie gaan wij onze Zip 70cc 2 Takt helemaal strippen en opnieuw opbouwen! Wij nemen jullie mee in dit hele proces en laten zien hoe alles gedaan moet worden! In deze aflevering gaan we de hele scooter strippen!\n' +
            //                 '\n' +
            //                 'Kappen + Binnenkappen Demonteren: 00:11\n' +
            //                 'SP Vork Demonteren: 13:00\n' +
            //                 'Achterrem Loshalen: 22:36\n' +
            //                 'Kabelboom Demonteren: 23:10\n' +
            //                 'Blok Loshalen: 26:05\n' +
            //                 'Uitlaat Demonteren: 30:17\n' +
            //                 'Overbrenging Demonteren: 35:42\n' +
            //                 'Achterwiel Demonteren: 39:43\n' +
            //                 'Vliegwiel / Ontsteking Demonteren: 42:30\n' +
            //                 'Cilinder / Zuiger Demonteren: 45:55\n' +
            //                 'Onderstandaard Demonteren: 50:00\n' +
            //                 '\n' +
            //                 ' Voor al je scooteronderdelen: https://freshparts.nl/ \n' +
            //                 '\n' +
            //                 'Afhalen is ook mogelijk in Veenendaal op afspraak, dit kan via Whatsapp 0645139760. \n' +
            //                 '\n' +
            //                 'Social Media: \n' +
            //                 'Instagram: /https://www.instagram.com/freshpartsnl/\n' +
            //                 'Facebook:  /https://www.facebook.com/profile.php?id=100092870396976&locale=nl_NL \n' +
            //                 'Tiktok: https://www.tiktok.com/@freshparts?la... \n' +
            //                 '\n' +
            //                 'Bij vragen/onduidelijkheden, aarzel dan niet om contact met ons op te nemen via whatsapp 0645139760 of info@freshparts.nl',
            //             thumbnail: [],
            //             allow_ratings: true,
            //             view_count: 3584,
            //             author: 'Fresh Parts',
            //             is_private: false,
            //             is_live: false,
            //             is_live_content: false,
            //             is_live_dvr_enabled: false,
            //             is_upcoming: false,
            //             is_crawlable: true,
            //             is_post_live_dvr: false,
            //             is_low_latency_live_stream: false,
            //             live_chunk_readahead: undefined,
            //             embed: {
            //                 iframe_url: 'https://www.youtube.com/embed/shmjr-fOpF0',
            //                 flash_url: undefined,
            //                 flash_secure_url: undefined,
            //                 width: 1280,
            //                 height: 720
            //             },
            //             channel: {
            //                 id: 'UCIEse2ctw0DcyQZ68ooxW4A',
            //                 name: 'Fresh Parts',
            //                 url: 'http://www.youtube.com/@freshparts'
            //             },
            //             is_unlisted: false,
            //             is_family_safe: true,
            //             category: 'Howto & Style',
            //             has_ypc_metadata: false,
            //             start_timestamp: null,
            //             end_timestamp: null,
            //             url_canonical: null,
            //             tags: null,
            //             like_count: 81,
            //             is_liked: false,
            //             is_disliked: false
            //         }
            //     }
                
            //     return { info: info, url: req.query.url };

            //     try {
            //         const yt = await Innertube.create();
            //         const info = await yt.getInfo(video_id);
            //         console.log(info);
            //         return { info: info, url: req.query.url };
            //     } catch (err) {
            //         console.error(err);
            //         return { error: "Failed to fetch video" };
            //     }
            // }
        }
    ],
    terms: {
        youtube: "By choosing to download, you acknowledge that the audio or video content you are accessing is for personal and non-commercial use only. You agree not to distribute, copy, modify or otherwise use the downloaded content for any commercial purpose, including but not limited to resale, public performance or broadcast. Any use of the content beyond the scope of these terms may result in a violation of applicable copyright law and the Terms of Service. We assume no liability for any unauthorized or improper use of the content, and the user assumes full responsibility for complying with all relevant laws and contractual obligations."
    }
}
module.exports = config;