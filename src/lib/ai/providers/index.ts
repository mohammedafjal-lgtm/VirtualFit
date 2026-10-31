import { registerProvider } from "../provider";
import { OpenAIProvider } from "./openai";

// Register every adapter here. Adding a new provider = one line.
registerProvider("openai", () => new OpenAIProvider());
// registerProvider("flux", () => new FluxProvider());       // future
// registerProvider("gemini", () => new GeminiProvider());   // future