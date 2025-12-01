require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

module.exports.GeminiResponse = async function main(content) {
    const wordSchema = {
        type: "object",
        properties: {
            words: {
                type: "array",
                items: {
                    type: "string",
                    description: "A single word"
                },
                minItems: 5,
                maxItems: 5,
                description: "An array of exactly five words"
            }
        },
        required: ["words"]
    };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: content,
            config: {
                responseMimeType: "application/json", // Specify JSON output
                responseSchema: wordSchema,          // Use the defined schema
            }
        });

        let jsonText= response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.log(error);

    }

}

