import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';
const handler = (m) => m;

handler.before = async (m) => {
    const chat = global.db.data.chats[m.chat];
    if (chat.simi) {
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        let textodem = m.text;
        try {
            const ressimi = await simitalk(textodem);
            await m.conn.sendMessage(m.chat, { text: ressimi.resultado.simsimi }, { quoted: m });
        } catch {
            throw '*[❗] API ميكو تواجه مشكلات.*';
        }
        return !0;
    }
    return true;
};
export default handler;

async function simitalk(ask, apikeyyy = "iJ6FxuA9vxlvz5cKQCt3", language = "es") {
    if (!ask) return { status: false, resultado: { msg: "يجب إدخال نص للتحدث مع ميكو." }};
    try {
        const response1 = await axios.get(`https://delirios-api-delta.vercel.app/tools/simi?text=${encodeURIComponent(ask)}`);
        const trad1 = await translate(`${response1.data.data.message}`, {to: language, autoCorrect: true});
        if (trad1.text == 'indefinida' || response1 == '' || !response1.data) trad1 = XD // يتم استخدام "XD" لإثارة خطأ واستخدام خيار آخر.  
        return { status: true, resultado: { simsimi: trad1.text }};        
    } catch {
        try {
            const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apikeyyy}&ask=${ask}&lc=${language}`);
            return { status: true, resultado: { simsimi: response2.data.message }};       
        } catch (error2) {
            return { status: false, resultado: { msg: "فشلت جميع الAPIs. حاول مرة أخرى لاحقًا.", error: error2.message }};
        }
    }
}
