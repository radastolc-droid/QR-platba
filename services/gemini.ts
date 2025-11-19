import { GoogleGenAI, Type } from "@google/genai";
import { ParsedPaymentResponse } from "../types";

// Inicializace klienta
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parsePaymentText = async (text: string): Promise<ParsedPaymentResponse> => {
  if (!text || text.trim().length === 0) {
    throw new Error("Text input is empty");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Jsi AI asistent pro zpracování platebních údajů. 
      Tvým úkolem je extrahovat částku (amount), variabilní symbol (variableSymbol) a zprávu pro příjemce (message) z textu.
      Pokud variabilní symbol není nalezen, vrat prázdný řetězec.
      Zpráva by měla být stručná.
      Analyzuj tento text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "Částka k platbě" },
            variableSymbol: { type: Type.STRING, description: "Variabilní symbol (čísla), pokud existuje" },
            message: { type: Type.STRING, description: "Zpráva pro příjemce nebo popis platby" },
            confidence: { type: Type.NUMBER, description: "Jistota parsování od 0 do 1" }
          },
          required: ["amount", "variableSymbol", "message", "confidence"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(jsonText) as ParsedPaymentResponse;
    return result;

  } catch (error) {
    console.error("Error parsing payment text:", error);
    throw error;
  }
};