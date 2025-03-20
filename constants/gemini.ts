import aiSchema from './ai-schema';

const BOT_ERROR_MESSAGE = 'Something went wrong !!';
const GEMINI_MODEL_NAME_V1 = 'gemini-2.0-pro-exp-02-05';
const GEMINI_MODEL_NAME_V2 = 'gemini-2.0-flash-exp';
const GEMINI_MODEL_NAME_V3 = 'gemini-2.0-flash-exp-image-generation';
const CACHE_TTL_SECONDS = 300;
const CACHE_DISPLAY_NAME = 'chat-conversation-cache';
const SYSTEM_INSTRUCTION = '';
const validMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
];

// Generation configuration
const generalConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const imageAnalysisConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: aiSchema.scanImagePlantSchema,
};

const phaseGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: aiSchema.plantGrowthPhasesSchema,
};

const scheduleGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: aiSchema.careScheduleSchema,
};

const taskGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: aiSchema.tasksSchema,
};

const checkHealthGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: aiSchema.plantHealthReportSchema,
};

export default {
  BOT_ERROR_MESSAGE,
  GEMINI_MODEL_NAME_V1,
  GEMINI_MODEL_NAME_V2,
  GEMINI_MODEL_NAME_V3,
  CACHE_DISPLAY_NAME,
  SYSTEM_INSTRUCTION,
  CACHE_TTL_SECONDS,
  validMimeTypes,
  generalConfig,
  imageAnalysisConfig,
  phaseGenerationConfig,
  scheduleGenerationConfig,
  taskGenerationConfig,
  checkHealthGenerationConfig,
};
