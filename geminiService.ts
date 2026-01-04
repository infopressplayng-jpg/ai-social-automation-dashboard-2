
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ActionStep } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development, but the environment must have the API key.
  console.warn("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const actionPlanSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: "The type of action to perform. Must be one of: 'OPEN_APP', 'SEARCH', 'SCROLL_FEED', 'LIKE_POST', 'COMMENT_ON_POST', 'VIEW_STORY', 'POST_CONTENT', 'CLOSE_APP', 'IDLE'.",
        },
        details: {
          type: Type.STRING,
          description: 'Details for the action, e.g., app name, search query, or topic for a comment. For IDLE, this can be a reason like "taking a break".',
        },
      },
      required: ['action', 'details'],
    },
};


export const generateActionPlan = async (goal: string, persona: string): Promise<ActionStep[]> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a social media automation controller for a device user with the persona of a "${persona}". 
        Given the high-level goal "${goal}", generate a JSON array of 5 to 7 simple, human-like actions to be performed on an Android device. 
        The actions must be tailored to the user's persona. For example, a "Foodie" should interact with food content.
        Include actions like 'SCROLL_FEED' and 'IDLE' for realism.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: actionPlanSchema,
        },
    });

    const text = response.text.trim();
    const plan = JSON.parse(text);
    return plan as ActionStep[];
  } catch (error) {
    console.error("Error generating action plan:", error);
    throw new Error("Failed to generate action plan from AI.");
  }
};


export const generateContent = async (topic: string, type: 'comment' | 'post', persona: string): Promise<string> => {
    const wordCount = type === 'comment' ? '15 words' : '30 words';
    const prompt = `You are a social media user with the persona of a "${persona}". Write a short, engaging, and friendly ${type} for a post about "${topic}". The ${type} should be under ${wordCount} and sound natural and authentic to your persona.`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        return response.text.trim().replace(/"/g, ''); // Remove quotes from response
    } catch (error) {
        console.error(`Error generating ${type}:`, error);
        throw new Error(`Failed to generate ${type} from AI.`);
    }
};

export const generateSocialUsername = async (interest: string): Promise<string> => {
    const prompt = `Generate one creative, short, and cool social media username related to the interest of "${interest}". Return only the username, without any extra text, symbols, or quotation marks. For example: PixelPioneer`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        return response.text.trim().replace(/["\.]/g, ''); // Remove quotes and periods
    } catch (error) {
        console.error(`Error generating username:`, error);
        throw new Error(`Failed to generate username from AI.`);
    }
};

export const suggestGoal = async (personas: string[]): Promise<string> => {
    const prompt = `Given a group of social media users with the following personas: ${personas.join(', ')}.
    Suggest one engaging, high-level social media goal for them to perform.
    The goal should be broad enough that each persona can interpret it in their own unique way.
    Return only the goal as a short string. Example: "Explore trending topics related to personal hobbies" or "Engage with content from influential creators".`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error(`Error suggesting goal:`, error);
        throw new Error(`Failed to suggest a goal from AI.`);
    }
};