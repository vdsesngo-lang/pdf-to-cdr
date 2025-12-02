import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const convertPdfToVector = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = getGeminiClient();
  
  // We use gemini-2.5-flash as it is efficient for multimodal tasks
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    Analyze the visual content of this document page. 
    I need to convert this into a vector graphic format compatible with CorelDRAW (CDR).
    
    Please generate a valid, high-fidelity SVG (Scalable Vector Graphics) code block that visually replicates the layout, text, shapes, and lines of this document as closely as possible.
    
    CRITICAL OUTPUT RULES:
    1. Return ONLY the raw SVG code. 
    2. Start directly with <svg ...> and end with </svg>.
    3. Do NOT include markdown code fences (like \`\`\`xml or \`\`\`svg).
    4. Do NOT include any conversational text before or after the code.
    5. Ensure all text is preserved as <text> elements where possible, or paths if strictly necessary for logo accuracy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated from Gemini.");
    }

    // Cleanup potential markdown if the model hallucinates fences despite instructions
    let cleanSvg = text.trim();
    if (cleanSvg.startsWith('```')) {
      cleanSvg = cleanSvg.replace(/^```(xml|svg)?\n/, '').replace(/```$/, '');
    }
    
    const svgStartIndex = cleanSvg.indexOf('<svg');
    const svgEndIndex = cleanSvg.lastIndexOf('</svg>');
    
    if (svgStartIndex !== -1 && svgEndIndex !== -1) {
      cleanSvg = cleanSvg.substring(svgStartIndex, svgEndIndex + 6);
    } else {
        // Fallback: if strictly no SVG tag found, throw error
        throw new Error("Failed to generate valid vector data.");
    }

    return cleanSvg;
  } catch (error) {
    console.error("Gemini Conversion Error:", error);
    throw error;
  }
};
