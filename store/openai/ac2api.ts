// ==================== 类型定义 ====================
// 文本模型
interface TextModel {
  name: string; // 显示名称
  modelName: string;
  type: "text";
  multimodal: boolean; // 前端显示用
  tool: boolean; // 前端显示用
  think: boolean; // 前端显示用
}

// 图像模型
interface ImageModel {
  name: string; // 显示名称
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
}
// 视频模型
interface VideoModel {
  name: string; // 显示名称
  modelName: string; //全局唯一
  type: "video";
  mode: (
    | "singleImage" // 单图
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[] // 混合参考
  )[];
  audio: "optional" | false | true; // 音频配置
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string; // 显示名称
  modelName: string;
  type: "tts";
  voices: {
    title: string; //显示名称
    voice: string; //说话人
  }[];
}
// 供应商配置
interface VendorConfig {
  id: string; //供应商唯一标识，必须全局唯一
  author: string;
  description?: string; //md5格式
  name: string;
  icon?: string; //仅支持base64格式
  inputs: {
    key: string;
    label: string;
    type: "text" | "password" | "url";
    required: boolean;
    placeholder?: string;
  }[];
  inputValues: Record<string, string>;
  models: (TextModel)[];
}

// ==================== 供应商数据 ====================
const vendor: VendorConfig = {
  id: "aiclient2api.4022543.xyz",
  author: "四零二二",
  description: "支持所有兼容AIClient2API中openai接口规范的API，仅支持文本\n\n欢迎使用我的其他插件：https://tf.4022543.xyz",
  name: "AIClient2API接口",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "url", required: true, placeholder: "默认 https://127.0.0.1:3000/openai-qwen-oauth/v1" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://127.0.0.1:3000/openai-qwen-oauth/v1"
  },
  models: [
    {
      name: "qwen3-coder-plus",
      type: "text",
      modelName: "qwen3-coder-plus",
      multimodal: true,
      tool: true,
      think:true
    },
    {
      name: "qwen3-coder-flash",
      type: "text",
      modelName: "qwen3-coder-flash",
      multimodal: true,
      tool: true,
      think:true
    },
    {
      name: "图片识别vision-model",
      type: "text",
      modelName: "vision-model",
      multimodal: true,
      tool: true,
      think:true
    },
  ],
};
exports.vendor = vendor;

// ==================== 全局工具函数 ====================
declare const axios: any;
declare const zipImageResolution: (completeBase64: string, width: number, height: number) => Promise<string>;
declare const pollTask: (
  fn: () => Promise<{ completed: boolean; data?: string; error?: string }>,
  interval?: number,
  timeout?: number,
) => Promise<{ completed: boolean; data?: string; error?: string }>;
declare const createOpenAI: any;
declare const exports: any;

// ==================== 工具函数 ====================
const DEFAULT_BASE_URL = "https://127.0.0.1:3000/openai-qwen-oauth/v1";//http://localhost:3000/openai-qwen-oauth/v1


const getApiKey = () => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  return vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
};

const stripTrailingSlash = (value?: string) => (value || "").replace(/\/+$/, "");

const parseBase64 = (input: string) => {
  const match = input.match(/^data:(.+?);base64,(.+)$/);
  if (match) {
    const mime = match[1] || "image/png";
    const base64 = match[2] || "";
    return { mime, base64 };
  }
  return { mime: "image/png", base64: input };
};

const getImageExtension = (mime: string) => {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
};

const getImageSize = (aspectRatio: `${number}:${number}`) => {
  const [widthRaw, heightRaw] = aspectRatio.split(":").map(Number);
  const width = Number.isFinite(widthRaw) ? widthRaw : 1;
  const height = Number.isFinite(heightRaw) ? heightRaw : 1;
  if (width === height) return "1024x1024";
  return width > height ? "1536x1024" : "1024x1536";
};

const getVideoSize = (resolution: string, aspectRatio: "16:9" | "9:16") => {
  const sizeMap: Record<string, Record<string, string>> = {
    "480p": { "16:9": "854x480", "9:16": "480x854" },
    "720p": { "16:9": "1280x720", "9:16": "720x1280" },
    "1:1": { "16:9": "720x720", "9:16": "720x720" },
  };
  return sizeMap[resolution]?.[aspectRatio] || (aspectRatio === "16:9" ? "1280x720" : "720x1280");
};

const ensureSuccess = async (response: any) => {
  if (response.ok) return;
  const errorText = await response.text();
  throw new Error(`请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
};

const buildSpeechInstructions = (ttsConfig: TTSConfig) => {
  const speechRate = Number.isFinite(ttsConfig.speechRate) ? ttsConfig.speechRate : 1;
  const pitchRate = Number.isFinite(ttsConfig.pitchRate) ? ttsConfig.pitchRate : 1;
  const volume = Number.isFinite(ttsConfig.volume) ? ttsConfig.volume : 1;
  return `Please speak naturally. Speed ${speechRate}x, pitch ${pitchRate}x, volume ${volume}x.`;
};

// ==================== 适配器函数 ====================

// 文本请求函数
const textRequest: (textModel: TextModel) => { url: string; model: string } = (textModel) => {
  const apiKey = getApiKey();
  return createOpenAI({
    baseURL: vendor.inputValues.baseUrl || DEFAULT_BASE_URL,//系统会自动加上/chat/completions
    apiKey,
  }).chat(textModel.modelName);
};
exports.textRequest = textRequest;

//图片请求函数
interface ImageConfig {
  prompt: string; //图片提示词
  imageBase64: string[]; //输入的图片提示词
  size: "1K" | "2K" | "4K"; // 图片尺寸
  aspectRatio: `${number}:${number}`; // 长宽比
}
const imageRequest = async (imageConfig: ImageConfig, imageModel: ImageModel) => {
  throw new Error(`图片功能暂未支持`);
};
exports.imageRequest = imageRequest;

interface VideoConfig {
  duration: number; //视频时长，单位秒
  resolution: string; //视频分辨率，如"720p"、"1080p"
  aspectRatio: "16:9" | "9:16"; //视频长宽比
  prompt: string; //视频提示词
  fileBase64?: string[]; // 文件base64 包含图片base64、视频base64、音频base64
  audio?: boolean;
  mode:
    | "singleImage" // 单图
    | "multiImage" // 多图模式
    | "gridImage" // 网格单图（传入一张图片，但该图片是网格图）
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[]; // 混合参考
}

const videoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  throw new Error(`视频功能暂未支持`);
};
exports.videoRequest = videoRequest;

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
}
const ttsRequest = async (ttsConfig: TTSConfig, ttsModel: TTSModel) => {
  throw new Error(`TTS功能暂未支持`);
};
exports.ttsRequest = ttsRequest;
