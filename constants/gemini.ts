const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const BOT_ERROR_MESSAGE = 'Something went wrong !!';
const GEMINI_MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
const CACHE_TTL_SECONDS = 300;
const CACHE_DISPLAY_NAME = 'chat-conversation-cache';
const SYSTEM_INSTRUCTION = '';

export default {
  GEMINI_API_KEY,
  BOT_ERROR_MESSAGE,
  GEMINI_MODEL_NAME,
  CACHE_DISPLAY_NAME,
  SYSTEM_INSTRUCTION,
  CACHE_TTL_SECONDS,
};
