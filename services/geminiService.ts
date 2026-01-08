
import { GoogleGenAI } from "@google/genai";
import { VideoRatio, VideoResolution } from "../types";

export const generateVideo = async (
  prompt: string,
  ratio: VideoRatio,
  resolution: VideoResolution,
  onStatusUpdate: (msg: string) => void
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing. Please select one.");

  // Create new instance per call as per instructions to ensure up-to-date key
  const ai = new GoogleGenAI({ apiKey });

  onStatusUpdate("Initializing cinematic engine...");
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution,
        aspectRatio: ratio
      }
    });

    onStatusUpdate("Crafting frames... This may take a few minutes.");
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      // Refresh operation status
      operation = await ai.operations.getVideosOperation({ operation: operation });
      
      const progressSteps = [
        "Analyzing prompt geometry...",
        "Simulating lighting and shadows...",
        "Rendering cinematic motion...",
        "Post-processing visual fidelity...",
        "Finalizing high-quality export..."
      ];
      onStatusUpdate(progressSteps[Math.floor(Math.random() * progressSteps.length)]);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video URI returned from the API.");

    // The download link needs the API key appended
    const finalUrl = `${downloadLink}&key=${apiKey}`;
    return finalUrl;
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_EXPIRED_OR_INVALID");
    }
    throw error;
  }
};
