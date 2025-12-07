import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are the "Ludo Grandmaster", an expert AI referee and assistant for the board game Ludo. 
Your tone is friendly, encouraging, but precise about rules.
The user is playing on a digital board with 4 colors: Blue (Top-Left), Red (Top-Right), Green (Bottom-Right), Yellow (Bottom-Left).
Rules context:
- Players need a 6 to move a token out of the base.
- A 6 gives an extra roll.
- The goal is to move all 4 tokens clockwise around the board to the center.
- There are safe zones marked with stars.
- Landing on an opponent sends them back to base.

Answer questions about strategy, rules, or just commentate on the game state if provided.
Keep answers concise (under 3 sentences) unless asked for a detailed explanation.
`;

export const getGeminiResponse = async (userMessage: string, history: {role: 'user'|'model', text: string}[] = []) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble consulting the rulebook right now. Please check your connection or API key.";
  }
};
