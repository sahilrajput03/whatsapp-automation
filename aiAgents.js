// @ts-nocheck

const { GoogleGenAI } = require("@google/genai");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
if (!GOOGLE_API_KEY) { throw new Error('❌GOOGLE_API_KEY environment variable is not set.'); }
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const AI_BOT_FLAG = "Piku 🌸";

const createSalesmanChat = () => ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
        // System Prompt: https://chatgpt.com/c/68c193d1-a0c8-8328-806d-074d71a4c931
        systemInstruction: "You are a friendly sales agent for YES PRINT. Talk in short Hinglish. Answer customer queries, suggest printing services (pamphlets, posters, banners, lamination, etc.), give prices if asked, and encourage quick orders. Keep replies simple, clear, and professional.",
    }
});

const aiAgents = {
    // Note: I'm keeing `aiSalesmanChat` outisde of `handleMessageBySalesman` as its helpful
    // 	to have context previous history without having to save to database
    // 	for testing purpose for now.
    salesmanChat: createSalesmanChat()
};
async function resetSalesmanChat(params) {
    aiAgents.salesmanChat = createSalesmanChat();
}
async function handleMessageBySalesman(message) {
    if (message.body === '!reset') {
        resetSalesmanChat();
        const chat = await message.getChat();
        await chat.sendMessage(`${AI_BOT_FLAG}: Reset ✅`);
    }
    else {
        const hasNoBotFlag = !message.body.includes(AI_BOT_FLAG);
        if (hasNoBotFlag) {
            try {
                const response1 = await aiAgents.salesmanChat.sendMessage({ message: message.body });
                // console.log("✅ Chat response 1:", response1.text);
                const chat = await message.getChat();
                await chat.sendMessage(`${AI_BOT_FLAG}: ${response1.text}`);
            } catch (error) {
                console.log('ERROR ❌❌ ❌ ❌ ❌ ❌ ❌  ', error.toString());
            }
        } else {
            console.log('\tBOT FLAG NOT FOUND', message.body);
        }
    }
};



module.exports = { aiAgents, handleMessageBySalesman, resetSalesmanChat, GOOGLE_API_KEY, AI_BOT_FLAG };