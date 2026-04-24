/**
 * 最强组合-四零二二API 供应商适配
 * @version 2.0
 */

// ============================================================
// 类型定义
// ============================================================

type VideoMode =
  | "singleImage"
  | "startEndRequired"
  | "endFrameOptional"
  | "startFrameOptional"
  | "text"
  | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[];

interface TextModel {
  name: string;
  modelName: string;
  type: "text";
  think: boolean;
}

interface ImageModel {
  name: string;
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
  associationSkills?: string;
}

interface VideoModel {
  name: string;
  modelName: string;
  type: "video";
  mode: VideoMode[];
  associationSkills?: string;
  audio: "optional" | false | true;
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string;
  modelName: string;
  type: "tts";
  voices: { title: string; voice: string }[];
}

interface VendorConfig {
  id: string;
  version: string;
  name: string;
  author: string;
  description?: string;
  icon?: string;
  inputs: { key: string; label: string; type: "text" | "password" | "url"; required: boolean; placeholder?: string }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel | TTSModel)[];
}

type ReferenceList =
  | { type: "image"; sourceType: "base64"; base64: string }
  | { type: "audio"; sourceType: "base64"; base64: string }
  | { type: "video"; sourceType: "base64"; base64: string };

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<ReferenceList, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  referenceList?: ReferenceList[];
  audio?: boolean;
  mode: VideoMode[];
}

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
  referenceList?: Extract<ReferenceList, { type: "audio" }>[];
}

interface PollResult {
  completed: boolean;
  data?: string;
  error?: string;
}

// ============================================================
// 全局声明
// ============================================================

declare const axios: any;
declare const logger: (msg: string) => void;
declare const jsonwebtoken: any;
declare const zipImage: (base64: string, size: number) => Promise<string>;
declare const zipImageResolution: (base64: string, w: number, h: number) => Promise<string>;
declare const mergeImages: (base64Arr: string[], maxSize?: string) => Promise<string>;
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>;
declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createMinimax: any;
declare const createGoogleGenerativeAI: any;
declare const exports: {
  vendor: VendorConfig;
  textRequest: (m: TextModel, t: boolean, tl: 0 | 1 | 2 | 3) => any;
  imageRequest: (c: ImageConfig, m: ImageModel) => Promise<string>;
  videoRequest: (c: VideoConfig, m: VideoModel) => Promise<string>;
  ttsRequest: (c: TTSConfig, m: TTSModel) => Promise<string>;
  checkForUpdates?: () => Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }>;
  updateVendor?: () => Promise<string>;
};
declare const FormData: any;
declare const Buffer: any;

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "best",
  version: "2.7",
  author: "四零二二",
  name: "最强组合-四零二二API",
  description:
    "最强组合，Gemini/ChatGPT/Claude + nano banana + seedance + index-tts\n\n四零二二API中转站，支持所有的模型接入，一个 key 搞定所有。\n\n源头供货，稳定价低，支持[免费试用](https://api.4022543.xyz/register?aff=3Y0U)\n\n邀请好友可返点。[点这里去注册](https://api.4022543.xyz/register?aff=3Y0U)\n\n如遇bug请联系微信：jxppro",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true, placeholder: "到上面的网站注册并复制 key 填入" },
    { key: "imageKey", label: "图像API密钥", type: "password", required: false, placeholder: "不填则使用API密钥" },
    { key: "videoKey", label: "视频API密钥", type: "password", required: false, placeholder: "不填则使用API密钥" },
    { key: "textKey", label: "文本API密钥", type: "password", required: false, placeholder: "不填则使用API密钥" },
    { key: "ttsKey", label: "语音API密钥", type: "password", required: false, placeholder: "不填则使用API密钥" },
  ],
  inputValues: {
    apiKey: "",
    imageKey: "",
    videoKey: "",
    textKey: "",
    ttsKey: "",
  },
  models: [
    { name: "GPT-image-2", type: "image", modelName: "gpt-image-2", mode: ["text", "singleImage", "multiReference"] },
    { name: "GPT-image-2-all(仅支持1k)", type: "image", modelName: "gpt-image-2-all", mode: ["text", "singleImage", "multiReference"] },
    { name: "Gemini-3.1-pro-preview", type: "text", modelName: "gemini-3.1-pro-preview", think: true },
    { name: "豆包 Seedream 5.0", type: "image", modelName: "doubao-seedream-5-0-260128", mode: ["text", "singleImage", "multiReference"] },
    { name: "豆包 Seedream 4.5", type: "image", modelName: "doubao-seedream-4-5-251128", mode: ["text", "singleImage", "multiReference"] },
    { name: "Gemini-3.1-flash-image-preview", type: "image", modelName: "gemini-3.1-flash-image-preview", mode: ["text", "singleImage", "multiReference"] },
    { name: "Gemini-3-pro-image-preview", type: "image", modelName: "gemini-3-pro-image-preview", mode: ["text", "singleImage", "multiReference"] },
    { name: "deepseek-v4-flash", type: "text", modelName: "deepseek-v4-flash", think: false },
    { name: "deepseek-v4-pro", type: "text", modelName: "deepseek-v4-pro", think: false },
    { name: "GPT-5.5", type: "text", modelName: "gpt-5.5", think: true },
    {
      name: "Seedance 1.5 pro",
      type: "video",
      modelName: "doubao-seedance-1-5-pro-251215",
      mode: ["text", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5, 10, 15], resolution: ["720p"] }],
    },
    {
      name: "viduq3-turbo",
      type: "video",
      modelName: "viduq3-turbo",
      mode: ["text", "startEndRequired", "endFrameOptional", "singleImage",["imageReference:3"]],
      audio: true,
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16], resolution: ["540p", "720p", "1080p"] }],
    },
    {
      name: "viduq3-pro",
      type: "video",
      modelName: "viduq3-pro",
      mode: ["text", "startEndRequired", "endFrameOptional", "singleImage",["imageReference:3"]],
      audio: true,
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16], resolution: ["540p", "720p", "1080p"] }],
    },
    { name: "gemini-3.1-flash-lite", type: "text", modelName: "gemini-3.1-flash-lite-preview", think: true },
    { name: "gemini-3.1-flash-preview", type: "text", modelName: "gemini-3-flash-preview", think: true },
    { name: "doubao-seed-2-0-code", type: "text", modelName: "doubao-seed-2-0-code-preview-260215", think: true },
    { name: "doubao-seed-2-0-lite", type: "text", modelName: "doubao-seed-2-0-lite-260215", think: true },
    { name: "GPT-5.4-mini", type: "text", modelName: "gpt-5.4-mini", think: true },
    { name: "GPT-5.4", type: "text", modelName: "gpt-5.4", think: true },
    { name: "GPT-5.4-pro", type: "text", modelName: "gpt-5.4-pro", think: true },
    { name: "Claude Sonnet 4.6", type: "text", modelName: "claude-sonnet-4-6", think: true },
    { name: "claude-opus-4-6", type: "text", modelName: "claude-opus-4-6", think: true },
    { name: "claude-opus-4-5-20251101", type: "text", modelName: "claude-opus-4-5-20251101", think: true },
    { name: "claude-haiku-4-5-20251001", type: "text", modelName: "claude-haiku-4-5-20251001", think: true },
    { name: "kimi-k2.5", type: "text", modelName: "kimi-k2.5", think: true },
    { name: "MiniMax-M2.7", type: "text", modelName: "minimax-m2.7", think: true },
    { name: "GLM-5", type: "text", modelName: "glm-5", think: true },
    { name: "GPT Image 1.5", type: "image", modelName: "gpt-image-1.5", mode: ["text", "singleImage", "multiReference"] },
    { name: "GPT Image 1", type: "image", modelName: "gpt-image-1", mode: ["text", "singleImage", "multiReference"] },
    {
      name: "veo3.1-4k",
      type: "video",
      modelName: "veo3.1-4k",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo3.1-pro-4k",
      type: "video",
      modelName: "veo3.1-pro-4k",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo3.1-pro",
      type: "video",
      modelName: "veo3.1-pro",
      mode: ["text", "startEndRequired", "endFrameOptional","singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo3.1-components",
      type: "video",
      modelName: "veo3.1-components",
      mode: ["endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo3.1-components-4k",
      type: "video",
      modelName: "veo3.1-components-4k",
      mode: ["endFrameOptional","singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo_3_1-lite",
      type: "video",
      modelName: "veo_3_1-lite",
      mode: ["singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "veo_3_1-lite-4K",
      type: "video",
      modelName: "veo_3_1-lite-4K",
      mode: ["singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [4,6,8], resolution: ["720p"] }],
    },
    {
      name: "viduq2-pro",
      type: "video",
      modelName: "viduq2-pro",
      mode: ["text", "startEndRequired", "endFrameOptional", "singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], resolution: ["540p", "720p", "1080p"] }],
    },
    {
      name: "viduq2-turbo",
      type: "video",
      modelName: "viduq2-turbo",
      mode: ["text", "startEndRequired", "endFrameOptional", "singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], resolution: ["540p", "720p", "1080p"] }],
    },
    {
      name: "kling-v3-omni",
      type: "video",
      modelName: "kling-v3-omni",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", ["videoReference:3", "imageReference:3"]],
      audio: true,
      durationResolutionMap: [{ duration: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p"] }],
    },
    {
      name: "kling-video-o1",
      type: "video",
      modelName: "kling-video-o1",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p"] }],
    },
    {
      name: "kling-v3",
      type: "video",
      modelName: "kling-v3",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5, 10], resolution: ["720p", "1080p"] }],
    },
    {
      name: "kling-v2-6",
      type: "video",
      modelName: "kling-v2-6",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5, 10], resolution: ["720p", "1080p"] }],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => "https://api.4022543.xyz";
const getTextUrl = () => `${getBaseUrl()}/v1`;
const getImageUrl = () => `${getBaseUrl()}/v1/images/generations`;
const getImageEditUrl = () => `${getBaseUrl()}/v1/images/edits`;

// 视频接口配置 - 不同模型使用不同接口
const getVeoVideoCreateUrl = () => `${getBaseUrl()}/v1/video/create`;
const getVeoVideoQueryUrl = () => `${getBaseUrl()}/v1/video/query?id={id}`;

// OpenAI 格式的 veo 接口 (veo_ 开头的模型)
const getVeoOpenAIVideoCreateUrl = () => `${getBaseUrl()}/v1/videos`;
const getVeoOpenAIVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/v1/videos/${taskId}`;

// Vidu 视频接口 - v2 版本
const getViduText2VideoUrl = () => `${getBaseUrl()}/ent/v2/text2video`;//文生视频
const getViduImage2VideoUrl = () => `${getBaseUrl()}/ent/v2/img2video`;//首帧
const getViduStartEnd2VideoUrl = () => `${getBaseUrl()}/ent/v2/start-end2video`;//首尾帧视频
const getViduReference2VideoUrl = () => `${getBaseUrl()}/ent/v2/reference2video`;//多参生成视频
const getViduVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/ent/v2/tasks/${taskId}/creations`;

const getKlingVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/text2video`;
const getKlingImageVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/image2video`;
const getKlingMultiImageVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/multi-image2video`;
const getKlingOmniVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/omni-video`;
const getKlingText2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/text2video/${taskId}`;
const getKlingImage2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/image2video/${taskId}`;
const getKlingMultiImage2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/multi-image2video/${taskId}`;
const getKlingOmniVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/omni-video/${taskId}`;

const getDoubaoVideoCreateUrl = () => `${getBaseUrl()}/volc/v1/contents/generations/tasks`;
const getDoubaoVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/volc/v1/contents/generations/tasks/${taskId}`;

const getApiKey = (type?: "image" | "video" | "text" | "tts"): string => {
  const keyMap: Record<string, string> = {
    image: "imageKey",
    video: "videoKey",
    text: "textKey",
    tts: "ttsKey",
  };
  const specificKey = type ? vendor.inputValues[keyMap[type]] : "";
  return specificKey || vendor.inputValues.apiKey;
};

const getAuthorization = (type?: "image" | "video" | "text" | "tts") => {
  const apiKey = getApiKey(type);
  if (!apiKey) throw new Error("请到 api.4022543.xyz 获取 API Key");
  return apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;
};

const normalizeBase64 = (completeBase64: string) => completeBase64.replace(/^data:[^;]+;base64,/, "");

const base64ToBuffer = (base64: string) => {
  return Buffer.from(base64, "base64");
};

const getFileMeta = (completeBase64: string, defaultName: string) => {
  const match = completeBase64.match(/^data:([^;]+);base64,/);
  const mimeType = match?.[1] || "image/jpeg";
  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/x-m4v": "m4v",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
  };
  return {
    mimeType,
    filename: `${defaultName}.${extensionMap[mimeType] || "bin"}`,
  };
};

const parseJsonResponse = async (response: any) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`接口返回了非 JSON 内容: ${text}`);
  }
};

const extractResult = (data: any): string | undefined => {
  const candidates = [
    data?.data?.task_result?.videos?.[0]?.url,
    data?.data?.task_result?.url,
    data?.creations?.[0]?.url,
    data?.data?.[0]?.url,
    data?.data?.[0]?.b64_json,
    data?.data?.[0]?.video_url,
    data?.data?.url,
    data?.data?.b64_json,
    data?.data?.result_url,
    data?.data?.video_url,
    data?.result_url,
    data?.video_url,
    data?.url,
    data?.b64_json,
  ];
  return candidates.find((item) => typeof item === "string" && item.length > 0);
};

const throwIfNotOk = async (response: any, action: string) => {
  if (response.ok) return;
  const errorText = await response.text();
  throw new Error(`${action}失败: ${response.status}, ${errorText}`);
};

const getImageInput = (images: string[], imageModel: ImageModel) => {
  if (!images.length) return undefined;
  if (imageModel.modelName === "doubao-seededit-3-0-i2i-250628") {
    return images[0];
  }
  return images.length === 1 ? images[0] : images;
};

const getDoubaoImageSize = (imageConfig: ImageConfig, modelName: string) => {
  const pixelMap: Record<string, Record<string, string>> = {
    "1K": {
      "1:1": "1024x1024",
      "16:9": "1280x720",
      "9:16": "720x1280",
      "3:2": "1248x832",
      "2:3": "832x1248",
      "4:3": "1152x864",
      "3:4": "864x1152",
      "21:9": "1512x648",
    },
    "2K": {
      "1:1": "2048x2048",
      "16:9": "2848x1600",
      "9:16": "1600x2848",
      "3:2": "2496x1664",
      "2:3": "1664x2496",
      "4:3": "2304x1728",
      "3:4": "1728x2304",
      "21:9": "3136x1344",
    },
    "3K": {
      "1:1": "3072x3072",
      "16:9": "4096x2304",
      "9:16": "2304x4096",
      "3:2": "3744x2496",
      "2:3": "2496x3744",
      "4:3": "3456x2592",
      "3:4": "2592x3456",
      "21:9": "4704x2016",
    },
    "4K": {
      "1:1": "4096x4096",
      "16:9": "5504x3040",
      "9:16": "3040x5504",
      "3:2": "4992x3328",
      "2:3": "3328x4992",
      "4:3": "4704x3520",
      "3:4": "3520x4704",
      "21:9": "6240x2656",
    },
  };

  if (modelName === "doubao-seededit-3-0-i2i-250628") {
    return "adaptive";
  }
  if (modelName === "doubao-seedream-3-0-t2i-250415") {
    return pixelMap["1K"][imageConfig.aspectRatio] || "1024x1024";
  }
  if (modelName.startsWith("doubao-seedream-5-0-")) {
    const size = imageConfig.size === "4K" ? "3K" : "2K";
    return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
  }
  if (modelName === "doubao-seedream-4-5-251128") {
    const size = imageConfig.size === "4K" ? "4K" : "2K";
    return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
  }
  const size = imageConfig.size;
  return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
};

const getGenericImageSize = (imageConfig: ImageConfig, modelName: string) => {
  const normalizedAspectRatio = imageConfig.aspectRatio === "9:16" ? "9:16" : imageConfig.aspectRatio === "16:9" ? "16:9" : "1:1";
  if (modelName === "dall-e-2") {
    // 对于 dall-e-2 必须是 256x256 、 512x512 或 1024x1024 之一，
    return normalizedAspectRatio === "16:9" ? "256x256" : normalizedAspectRatio === "9:16" ? "256x256" : "1024x1024";
  }
  if (modelName === "dall-e-3") {
    // 对于 dall-e-3 必须是 1024x1024 、 1792x1024 或 1024x1792 之一。
    return normalizedAspectRatio === "16:9" ? "1792x1024" : normalizedAspectRatio === "9:16" ? "1024x1792" : "1024x1024";
  }
  if(modelName.startsWith("gpt-image-2")){
    // 1024x1024 正方形 1536x1024 横版 1024x1536 竖版
    // 2048x2048 2K正方形 2048x1152 2K横版
    // 3840x2160 4K横版 2160x3840 4K竖版
    const gptImage2SizeMap: Record<string, Record<string, string>> = {
        "1:1": { "1k": "1024x1024", "2k": "2048x2048", "4k": "3840x3840" },
        "16:9": { "1k": "1536x1024", "2k": "2048x1152", "4k": "3840x2160" },
        "9:16": { "1k": "1024x1536", "2k": "1152x2048", "4k": "2160x3840" },
    };
    return gptImage2SizeMap[normalizedAspectRatio]?.[imageConfig.size.toLowerCase()] || gptImage2SizeMap["1:1"]["1k"];

  }else if (modelName.startsWith("gpt-image-")) {
    // 生成图像的尺寸。对于 GPT 图像模型，必须是 1024x1024 、 1536x1024 （横版）、 1024x1536 （竖版）或 auto （默认值）之一，
    return normalizedAspectRatio === "16:9" ? "1536x1024" : normalizedAspectRatio === "9:16" ? "1024x1536" : "1024x1024";
  }
  if (modelName === "grok-3-image") {
    return normalizedAspectRatio === "16:9" ? "1280x720" : normalizedAspectRatio === "9:16" ? "720x1280" : "960x960";
  }
  return normalizedAspectRatio === "16:9" ? "1536x1024" : normalizedAspectRatio === "9:16" ? "1024x1536" : "1024x1024";
};

const getQueryUrlWithId = (template: string, id: string) => {
  if (template.includes("{id}")) {
    return template.replace("{id}", encodeURIComponent(id));
  }
  const separator = template.includes("?") ? "&" : "?";
  return `${template}${separator}id=${encodeURIComponent(id)}`;
};

const getTaskStatus = (data: any) => String(data?.status || data?.data?.status || data?.data?.task_status || data?.state || "").toLowerCase();

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  const apiKey = getAuthorization("text").replace(/^Bearer\s+/, "");
  if (think && thinkLevel > 0) {
      // 模型名称变体，根据思考等级转换，1=low,2=medium, 3=high
      const think_lv = thinkLevel === 1 ? "low" : thinkLevel === 2 ? "medium" : "high";
      if(model.modelName.startsWith("gpt-5") && model.modelName.includes("-codex")){
          model.modelName = `${model.modelName}-${think_lv}`;
      // }else if (model.modelName.includes("gemini-3.1-pro-preview") || model.modelName.includes("gemini-3.1-flash-lite-preview")) {
      //     model.modelName = `${model.modelName}-thinking-${think_lv}`;
      }else{
        //有思考模式，但暂不支持等级的模型
        const thinkingModel = ["claude-", "gemini-3-pro-preview","deepseek-v3.2"]
        for(const model_item of thinkingModel){
          if(model.modelName.startsWith(model_item)){
            //暂不支持等级
            model.modelName = `${model.modelName}-thinking`;
            break;
          }
        }
      }
  }
  return createOpenAI({ baseURL: getTextUrl(), apiKey }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const imageRefs = (config.referenceList ?? []).map((r) => r.base64);

  logger(`[imageRequest] 提交图像生成任务，模型: ${model.modelName}`);
  if (model.modelName.startsWith("gemini-") && model.modelName.includes("image")) {
    return geminiImageRequest(config, model, imageRefs);
  }
  const qualityMap: Record<string, string> = {
    "1K": "low",
    "2K": "medium",
    "4K": "high",
  };
  const dallQualityMap: Record<string, string> = {
    "1K": "standard",
    "2K": "hd",
    "4K": "hd",
  };
  if ((model.modelName.startsWith("gpt-image-") || model.modelName.startsWith("flux-")  || model.modelName.startsWith("dall-e-") || model.modelName.startsWith("grok-")) && imageRefs.length > 0) {
    // 走 /v1/images/edits 端点且multipart/form-data提交方式

    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("n", "1");

    if(model.modelName.startsWith("grok-")){
      formData.append("aspect_ratio", config.aspectRatio);
      formData.append("quality", qualityMap[config.size] || "medium");//文档有点奇怪，这 2 个正常只使用 1 个的
      formData.append("resolution", config.size);//文档有点奇怪，这 2 个正常只使用 1 个的

    }else if(model.modelName.startsWith("flux-")){
      formData.append("aspect_ratio", config.aspectRatio);
      formData.append("quality", qualityMap[config.size] || "medium");
    }else{
      formData.append("size", getGenericImageSize(config, model.modelName));
      formData.append("quality", qualityMap[config.size] || "medium");
    }

    for (const [index, completeBase64] of imageRefs.entries()) {
      const normalized = normalizeBase64(completeBase64);
      const { filename } = getFileMeta(completeBase64, `image-${index + 1}`);
      formData.append("image", base64ToBuffer(normalized), filename);
    }

    const response = await axios.post(getImageEditUrl(), formData, {
      headers: {
        Authorization: getAuthorization("image"),
        ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}),
      },
    });

    const data = response?.data;
    const result = extractResult(data);
    if (!result) throw new Error(`${model.modelName} 图片编辑成功但未返回可用结果: ${JSON.stringify(data)}`);
    return result;
  }
  // 其他模型使用 v1/images/generations 端点
  const body: Record<string, any> = {
    model: model.modelName,
    prompt: config.prompt,
  };

  if (model.modelName.startsWith("doubao-")) {
    body.size = getDoubaoImageSize(config, model.modelName);
    body.watermark = false;
    if (model.modelName === "doubao-seedream-5-0-260128") {
      body.output_format = "png";
    }
    const imageInput = getImageInput(imageRefs, model);
    if (imageInput) body.image = imageInput;
    if (["doubao-seedream-5-0-260128", "doubao-seedream-4-5-251128", "doubao-seedream-4-0-250828"].includes(model.modelName)) {
      body.sequential_image_generation = "disabled";
    }
  } else {
    body.size = getGenericImageSize(config, model.modelName);
    body.n = 1;

    if (model.modelName === "dall-e-3" || model.modelName.startsWith("flux-")) {
      body.quality = dallQualityMap[config.size] || "hd";
      body.style = "vivid";
    }else if(model.modelName.startsWith("gpt-image-")){
      //gpt-image-2-all仅支持 1k

      body.quality = qualityMap[config.size] || "medium";//可选：low 、 medium 、 high 、 auto（默认）
    }

    if (model.modelName === "qwen-image-max") {
      body.size = "1024x1024";
    }
    if(imageRefs.length > 0){
      body.image = imageRefs;

      if(!body.quality && !body.resolution){
        body.quality = qualityMap[config.size] || "medium";
      }
    }
  }

  const response = await fetch(getImageUrl(), {
    method: "POST",
    headers: { Authorization: getAuthorization("image"), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(response, "图片生成");

  const data = await parseJsonResponse(response);
  const result = extractResult(data);
  if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
  return result;
};

// ==================== Gemini 图像生成 ====================
const geminiImageRequest = async (config: ImageConfig, model: ImageModel, imageRefs: string[]): Promise<string> => {
  const apiKey = getApiKey("image").replace(/^Bearer\s+/, "");
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/v1beta/models/${model.modelName}:generateContent?key=${apiKey}`;

  // 构建 requestParts 数组
  const requestParts: any[] = [{ text: config.prompt }];

  // 添加参考图片
  for (const base64 of imageRefs) {
    const normalized = normalizeBase64(base64);
    const meta = getFileMeta(base64, "image");
    requestParts.push({
      inline_data: {
        mime_type: meta.mimeType,
        data: normalized,
      },
    });
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: requestParts,
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.size,
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${model.modelName}图像生成请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
  }

  const data = await parseJsonResponse(response);

  // 从响应中提取图片数据
  // Gemini 返回格式: candidates[0].content.parts[].inline_data.data
  const candidates = data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error(`Gemini 响应中没有 candidates: ${JSON.stringify(data)}`);
  }

  const responseParts = candidates[0]?.content?.parts;
  if (!responseParts || responseParts.length === 0) {
    throw new Error(`Gemini 响应中没有 parts: ${JSON.stringify(data)}`);
  }

  // 查找包含图片的 part
  for (const part of responseParts) {
    const inlineData = part.inline_data || part.inlineData;
    if (inlineData?.data) {
      const mimeType = inlineData.mime_type || inlineData.mimeType || "image/png";
      return `data:${mimeType};base64,${inlineData.data}`;
    }
  }

  throw new Error(`未能从 Gemini 响应中提取图片: ${JSON.stringify(data)}`);
};

// ==================== Veo 视频生成 (OpenAI 格式) ====================
const veoOpenAIFormatVideoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  logger(`[veoOpenAIFormatVideoRequest] 提交视频任务，模型: ${model.modelName}`);

  const formData = new FormData();
  formData.append("model", model.modelName);
  formData.append("prompt", config.prompt);
  formData.append("seconds", String(config.duration));
  formData.append("size", config.aspectRatio.replace(":", "x"));
  formData.append("watermark", "false");

  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image");
  if (imageRefs.length > 0) {
    const { filename } = getFileMeta(imageRefs[0].base64, "reference");
    const base64Data = normalizeBase64(imageRefs[0].base64);
    const buffer = base64ToBuffer(base64Data);
    formData.append("input_reference", buffer, filename);
  }

  const createResponse = await axios.post(getVeoOpenAIVideoCreateUrl(), formData, {
    headers: { Authorization: getAuthorization("video") },
  });
  if (createResponse.status !== 200) {
    throw new Error(`${model.modelName}视频任务创建失败: ${createResponse.status}, ${JSON.stringify(createResponse.data)}`);
  }

  const createData = createResponse.data;
  const taskId = createData?.id || createData?.task_id;
  if (!taskId) throw new Error(`${model.modelName}视频任务创建失败: ${JSON.stringify(createData)}`);

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getVeoOpenAIVideoQueryUrl(taskId), {
      method: "GET",
      headers: { Authorization: getAuthorization("video") },
    });
    await throwIfNotOk(queryResponse, "视频任务查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = getTaskStatus(queryData);
    logger(`[veoOpenAIFormatVideoRequest] 任务状态: ${status}`);

    if (["completed", "success", "succeed"].includes(status)) {
      return { completed: true, data: extractResult(queryData) };
    }
    if (["failed", "failure"].includes(status)) {
      return { completed: true, error: queryData?.error?.message || `${model.modelName}视频生成失败` };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) throw new Error("视频任务完成，但未返回可用下载地址");
  return result.data;
};

// ==================== Veo 视频生成 (原有格式) ====================
const veoVideoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const createBody: Record<string, any> = {
    model: model.modelName,
    prompt: config.prompt,
    duration: config.duration,
    resolution: config.resolution,
    aspect_ratio: config.aspectRatio,//仅veo3支持，“16:9”或“9:16”
  };
  if(model.modelName.startsWith("veo2") && config.duration === 4){
    //veo2 支持 5,6,8 秒视频
    createBody.duration = 5;
  }
  // 从 referenceList 提取图片
  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);

  if(typeof config.audio === "boolean"){
    createBody.audio = config.audio
  }
  if (config.resolution === "1080p") {
    createBody.enable_upsample = true;
  }
  // createBody.enhance_prompt = false;//由于 veo 只支持英文提示词，所以如果需要中文自动转成英文提示词，可以开启此开关

  if (imageRefs.length > 0) {
    createBody.images = imageRefs;
  }

  const createResponse = await fetch(getVeoVideoCreateUrl(), {
    method: "POST",
    headers: {
      Authorization: getAuthorization("video"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "Veo视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.id || createData?.task_id;
  if (!taskId) {
    throw new Error(`${model.modelName}视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getQueryUrlWithId(getVeoVideoQueryUrl(), taskId), {
      method: "GET",
      headers: { Authorization: getAuthorization("video") },
    });
    await throwIfNotOk(queryResponse, "Veo视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = getTaskStatus(queryData);

    if (status === "completed" || status === "success") {
      const videoUrl = extractResult(queryData);
      return { completed: true, data: videoUrl };
    }
    if (status === "failed" || status === "failure") {
      return { completed: true, error: queryData?.error?.message || `${model.modelName}视频生成失败` };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error(`${model.modelName}视频任务完成，但未返回可用下载地址`);
  }
  return result.data;
};

// ==================== Vidu 视频生成 ====================
const viduVideoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  // 从 referenceList 提取图片
  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);
  const audioRefs = (config.referenceList ?? []).filter((r) => r.type === "audio").map((r) => r.base64);
  const videoRefs = (config.referenceList ?? []).filter((r) => r.type === "video").map((r) => r.base64);
  const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;
  const isStartEndMode = activeMode === "startEndRequired" || activeMode === "endFrameOptional";
  const isMultiReferenceMode = Array.isArray(config.mode) && typeof activeMode === "string" && activeMode.startsWith("imageReference");

  let url: string;
  const body: Record<string, any> = {
    model: model.modelName,
    prompt: config.prompt,
    duration: config.duration,
    resolution: config.resolution,
    aspect_ratio: config.aspectRatio,
  };

  // 根据模式选择接口
  if (isMultiReferenceMode) {
    // 多参考模式
    url = getViduReference2VideoUrl();
    body.images = imageRefs;
    // if(audioRefs.length > 0){
        // 视频生成模型不支持音频
    // }
    if(videoRefs.length > 0){
      body.videos = videoRefs;
    }
  } else if (isStartEndMode && imageRefs.length >= 2) {
    // 首尾帧模式
    url = getViduStartEnd2VideoUrl();
    body.images = imageRefs.slice(0, 2);
  } else if (imageRefs.length === 1) {
    // 单图模式
    url = getViduImage2VideoUrl();
    body.images = imageRefs;
  } else {
    // 纯文本模式
    url = getViduText2VideoUrl();
  }

  if (typeof config.audio === "boolean") {
    body.audio = config.audio;
  }
  body.watermark = false;//关闭水印
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthorization("video"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(response, "Vidu视频任务创建");

  const data = await parseJsonResponse(response);
  const taskId = data?.id || data?.task_id;
  if (!taskId) {
    throw new Error(`${model.modelName}视频任务创建失败: ${JSON.stringify(data)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getViduVideoQueryUrl(taskId), {
      method: "GET",
      headers: { Authorization: getAuthorization("video") },
    });
    await throwIfNotOk(queryResponse, "Vidu视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = getTaskStatus(queryData);
    if (status === "completed" || status === "success" || status === "succeed") {
      const videoUrl = extractResult(queryData);
      return { completed: true, data: videoUrl };
    }
    if (status === "failed" || status === "failure") {
      return { completed: true, error: `${model.modelName}:${queryData?.error?.message}` || `${model.modelName}视频生成失败` };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(`${model.modelName}:${result.error}`);
  if (!result.data) {
    throw new Error(`${model.modelName}视频任务完成，但未返回可用下载地址`);
  }
  return await urlToBase64(result.data);

};

// ==================== Kling 视频生成 ====================
const klingVideoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  // 从 referenceList 提取图片和视频引用
  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);
  const videoRefs = (config.referenceList ?? []).filter((r) => r.type === "video").map((r) => r.base64);

  const activeMode = config.mode[0];
  const isMultiReferenceMode = Array.isArray(activeMode) || model.modelName.startsWith("kling-video-o1") || model.modelName.startsWith("kling-v3-omni");

  let url: string;
  let queryUrl: (taskId: string) => string;
  let body: Record<string, any> = {
    model_name: model.modelName,
    prompt: config.prompt,
    duration: config.duration,
    resolution: config.resolution,
    aspect_ratio: config.aspectRatio,
  };
  if (typeof config.audio === "boolean") {
      body.sound = config.audio ? "on" : "off";
  }
  body.watermark_info = {
    "enabled": false // true 为生成，false 为不生成
  }
  // 根据模式选择接口
  if (isMultiReferenceMode) {
    // 多参考模式（Omni）
    url = getKlingOmniVideoCreateUrl();
    queryUrl = getKlingOmniVideoQueryUrl;
    // Omni 模式使用 image_list 和 video_list 格式
    if (imageRefs.length > 0) {
      body.image_list = imageRefs.map((base64: string) => ({
        image_url: base64,
        type: "first_frame"
      }));
    }
    if (videoRefs.length > 0) {
      body.video_list = videoRefs.map((base64: string) => ({
        video_url: base64,
        refer_type: "base",
        keep_original_sound: "yes"
      }));
    }
  }else if(imageRefs.length >= 2 ){
    //多图参考
    url = getKlingMultiImageVideoCreateUrl();
    queryUrl = getKlingMultiImage2VideoQueryUrl;
    body.images = imageRefs.slice(0, 4);
  } else if (imageRefs.length <= 2 && activeMode == "startEndRequired") {
    // 首尾帧模式
    url = getKlingImageVideoCreateUrl();
    queryUrl = getKlingImage2VideoQueryUrl;
    body.image = imageRefs[0];
    body.image_tail = imageRefs[1];
  } else if (imageRefs.length === 1) {
    // 单图模式
    url = getKlingImageVideoCreateUrl();
    queryUrl = getKlingImage2VideoQueryUrl;
    body.image = imageRefs[0];
  } else {
    // 纯文本模式
    url = getKlingVideoCreateUrl();
    queryUrl = getKlingText2VideoQueryUrl;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthorization("video"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(response, "Kling视频任务创建");

  const data = await parseJsonResponse(response);
  const taskId = data?.id || data?.task_id || data?.data?.id || data?.data?.task_id;
  if (!taskId) {
    throw new Error(`${model.modelName}视频任务创建失败: ${JSON.stringify(data)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(queryUrl(taskId), {
      method: "GET",
      headers: { Authorization: getAuthorization("video") },
    });
    await throwIfNotOk(queryResponse, "Kling视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = getTaskStatus(queryData);
    if (status === "completed" || status === "success" || status === "succeed") {
      const videoUrl = extractResult(queryData);
      return { completed: true, data: videoUrl };
    }
    if (status === "failed" || status === "failure") {
      return { completed: true, error: queryData?.error?.message || `${model.modelName}视频生成失败` };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error(`${model.modelName}视频任务完成，但未返回可用下载地址`);
  }
  return await urlToBase64(result.data);
  // return result.data;
};

// ==================== 豆包视频生成 ====================
const doubaoVideoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  // 从 referenceList 提取图片
  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);

  // 构建参数字符串（追加到提示词后面）
  const params: string[] = [];
  if (config.resolution) {
    params.push(`--resolution ${config.resolution.toLowerCase()}`);
  }
  if (config.aspectRatio) {
    params.push(`--ratio ${config.aspectRatio}`);
  }
  if (config.duration) {
    params.push(`--duration ${config.duration}`);
  }
  params.push("--watermark false");

  // 构建 content 数组
  const content: any[] = [
    {
      type: "text",
      text: `${config.prompt} ${params.join(" ")}`.trim(),
    },
  ];
  const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;
  // 添加图片到 content
  if (imageRefs.length > 0) {
    const isStartEndMode = (
      activeMode === "startEndRequired" ||
      activeMode === "endFrameOptional" ||
      activeMode === "startFrameOptional"
    );
    
    if (isStartEndMode && imageRefs.length == 2) {
      // 首尾帧模式：首帧需要 role: "first_frame"，尾帧需要 role: "last_frame"
      content.push({
        type: "image_url",
        image_url: { url: imageRefs[0] },
        role: "first_frame",
      });
      content.push({
        type: "image_url",
        image_url: { url: imageRefs[1] },
        role: "last_frame",
      });
    } else if (imageRefs.length === 1) {
      // 单图模式：首帧（不需要 role 字段）
      content.push({
        type: "image_url",
        image_url: { url: imageRefs[0] },
      });
    } else if (imageRefs.length >= 1) {
      // 参考图模式：reference_image
      for (const imageRef of imageRefs) {
        content.push({
          type: "image_url",
          image_url: { url: imageRef },
          role: "reference_image",
        });
      }
    }
  }

  const createBody: Record<string, any> = {
    model: model.modelName,
    content: content,
  };
  if(typeof config.audio === "boolean"){
    createBody.generate_audio = config.audio
  }
  const createResponse = await fetch(getDoubaoVideoCreateUrl(), {
    method: "POST",
    headers: {
      Authorization: getAuthorization("video"),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "豆包视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.id || createData?.task_id;
  if (!taskId) {
    throw new Error(`${model.modelName}视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getDoubaoVideoQueryUrl(taskId), {
      method: "GET",
      headers: {
        Authorization: getAuthorization("video"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await throwIfNotOk(queryResponse, "豆包视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = String(queryData?.status || "").toLowerCase();

    // 豆包响应格式: content.video_url
    const videoUrl = queryData?.content?.video_url;

    if (videoUrl && status === "succeeded") {
      return { completed: true, data: videoUrl };
    }
    if (status === "succeeded") {
      return { completed: true, data: videoUrl || taskId };
    }
    if (["failed", "failure", "error"].includes(status)) {
      return { completed: false, error: queryData?.fail_reason || `${model.modelName}视频生成失败` };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error(`${model.modelName}视频任务完成，但未返回可用下载地址`);
  }
  return result.data;
};

// ==================== 视频请求分发 ====================
const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const modelName = model.modelName;

  // 根据模型名称分发到不同的处理函数
  if (modelName.startsWith("veo_")) {
    // veo_ 开头的模型使用 OpenAI 格式接口 (/v1/videos)
    return veoOpenAIFormatVideoRequest(config, model);
  } else if (modelName.startsWith("veo")) {
    // 其他 veo 开头的模型使用原有格式接口
    return veoVideoRequest(config, model);
  } else if (modelName.startsWith("viduq") || modelName.startsWith("vidu")) {
    return viduVideoRequest(config, model);
  } else if (modelName.startsWith("kling")) {
    return klingVideoRequest(config, model);
  } else if (modelName.startsWith("doubao-seedance-1")) {
    return doubaoVideoRequest(config, model);
  }

  // 默认使用 Veo 接口
  return veoVideoRequest(config, model);
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  try {
    const apiVendorUrl = `https://tf-api.4022543.xyz/api/vendor/${vendor.id}`;
    const response = await axios.get(apiVendorUrl, {
      timeout: 10000,
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });

    const data = response.data;

    if (!data || !data.success || !data.vendor) {
      // throw new Error("API 返回数据格式错误");
      return {
        hasUpdate: false,
        latestVersion: vendor.version,
        notice: ""
      };
    }

    const remoteVersion = data.vendor.version;
    const currentVersion = vendor.version;
    const hasUpdate = remoteVersion !== currentVersion;

    return {
      hasUpdate,
      latestVersion: remoteVersion,
      notice: hasUpdate ? `发现新版本 ${remoteVersion}，当前版本 ${currentVersion}` : "已是最新版本"
    };
  } catch (error: any) {
    return {
      hasUpdate: false,
      latestVersion: vendor.version,
      notice: `检查更新失败: ${error.message || "未知错误"}`
    };
  }
};

const updateVendor = async (): Promise<string> => {
  try {
    const remoteVendorUrl = `https://tf.4022543.xyz/store/4022/${vendor.id}.ts`;
    const response = await axios.get(remoteVendorUrl, {
      timeout: 30000,
      headers: {
        "Accept": "text/plain",
        "Cache-Control": "no-cache"
      }
    });

    const remoteCode = response.data as string;

    if (!remoteCode || remoteCode.length < 100) {
      throw new Error("获取到的代码内容无效");
    }

    // 验证代码基本结构
    if (!remoteCode.includes("const vendor:") || !remoteCode.includes("exports.vendor")) {
      throw new Error("获取到的代码结构不完整");
    }

    return remoteCode;
  } catch (error: any) {
    throw new Error(`更新失败: ${error.message || "未知错误"}`);
  }
};

// ============================================================
// 导出
// ============================================================

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

export {};
