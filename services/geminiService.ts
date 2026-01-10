
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeSymptoms(symptoms: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise os seguintes sintomas e sugira a especialidade médica mais adequada. 
        Seja empático e inclua um aviso de que isso não substitui uma consulta médica.
        Sintomas: "${symptoms}"
        Responda em Português do Brasil com um formato estruturado.`,
        config: {
          systemInstruction: "Você é um assistente médico inteligente do site MedAgendar. Seu papel é ajudar pacientes a encontrar a especialidade correta baseada em sintomas descritos, sempre mantendo um tom profissional e acolhedor."
        }
      });

      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Desculpe, tive um problema ao analisar seus sintomas. Por favor, tente novamente ou procure um clínico geral.";
    }
  }

  async searchSpecialistRecommendation(query: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `O usuário está procurando por: "${query}". 
        Com base nisso, sugira 3 especialidades médicas que poderiam ajudar e explique o porquê de forma curta.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      return response.text;
    } catch (error) {
      return "Não consegui processar sua busca inteligente agora.";
    }
  }
}

export const geminiService = new GeminiService();
