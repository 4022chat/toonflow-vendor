/**
 * Grok2API 供应商适配
 * @version 1.0
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

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "grok",
  version: "1.0",
  author: "Toonflow",
  name: "Grok2API",
  description: "Grok2API OpenAI 兼容网关，支持 Grok 文本、Imagine 图片和视频模型。",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true, placeholder: "g2a_..." },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "例如：http://127.0.0.1:8000/v1" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "http://127.0.0.1:8000/v1",
  },
  models: [
    { name: "Grok Chat Fast", modelName: "grok-chat-fast", type: "text", think: false },
    { name: "Grok Chat Heavy", modelName: "grok-chat-heavy", type: "text", think: false },
    { name: "Grok Chat Expert", modelName: "grok-chat-expert", type: "text", think: false },
    { name: "Grok 4.3", modelName: "grok-4.3", type: "text", think: false },
    { name: "Grok 4.20 Reasoning", modelName: "grok-4.20-0309-reasoning", type: "text", think: true },
    { name: "Grok 4.20 Non-Reasoning", modelName: "grok-4.20-0309-non-reasoning", type: "text", think: false },
    { name: "Grok 4.20 Multi-Agent", modelName: "grok-4.20-multi-agent-0309", type: "text", think: true },
    { name: "Grok Imagine Image Quality", modelName: "grok-imagine-image-quality", type: "image", mode: ["text"] },
    { name: "Grok Imagine Image", modelName: "grok-imagine-image", type: "image", mode: ["text"] },
    { name: "Grok Imagine Image Edit", modelName: "grok-imagine-image-edit", type: "image", mode: ["singleImage", "multiReference"] },
    { name: "Grok Imagine Video", modelName: "grok-imagine-video", type: "video", mode: ["text"], audio: true, durationResolutionMap: [{ duration: [8], resolution: ["720p"] }] },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");

const getAuthorization = () => {
  const apiKey = vendor.inputValues.apiKey.trim().replace(/^Bearer\s+/i, "");
  if (!apiKey) throw new Error("缺少 API 密钥");
  return `Bearer ${apiKey}`;
};

const getErrorMessage = (data: any, fallback: string) => {
  return data?.error?.message || data?.error || data?.message || fallback;
};

const getImageResult = async (data: any): Promise<string> => {
  const result = data?.data?.[0];
  if (typeof result?.b64_json === "string" && result.b64_json) {
    return `data:image/png;base64,${result.b64_json}`;
  }
  if (typeof result?.url === "string" && result.url) {
    return await urlToBase64(result.url);
  }
  throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  return createOpenAI({
    baseURL: getBaseUrl(),
    apiKey: vendor.inputValues.apiKey.trim().replace(/^Bearer\s+/i, ""),
  }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const imageRefs = (config.referenceList ?? []).map((reference) => reference.base64).filter(Boolean);
  const isEdit = model.modelName === "grok-imagine-image-edit";

  if (imageRefs.length > 0 && !isEdit) {
    throw new Error(`${model.name} 不支持图片参考，请选择 Grok Imagine Image Edit`);
  }

  const body: Record<string, any> = {
    model: model.modelName,
    prompt: config.prompt,
    n: 1,
    response_format: "url",
  };

  if (isEdit) {
    if (!imageRefs.length) throw new Error("Grok Imagine Image Edit 需要至少一张参考图片");
    if (imageRefs.length === 1) {
      body.image = { url: imageRefs[0] };
    } else {
      body.images = imageRefs.map((url) => ({ url }));
    }
  }

  const endpoint = isEdit ? "/images/edits" : "/images/generations";
  logger(`提交图片任务: ${model.modelName}`);
  try {
    const response = await axios.post(`${getBaseUrl()}${endpoint}`, body, {
      headers: { Authorization: getAuthorization(), "Content-Type": "application/json" },
    });
    return await getImageResult(response.data);
  } catch (error: any) {
    throw new Error(`图片请求失败: ${getErrorMessage(error?.response?.data, error?.message || "未知错误")}`);
  }
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if ((config.referenceList ?? []).length > 0) {
    throw new Error("Grok Imagine Video 当前接口文档仅支持文生视频");
  }

  logger(`提交视频任务: ${model.modelName}`);
  let taskId: string;
  try {
    const response = await axios.post(`${getBaseUrl()}/videos/generations`, {
      model: model.modelName,
      prompt: config.prompt,
      duration: config.duration,
      aspect_ratio: config.aspectRatio,
      resolution: config.resolution,
    }, {
      headers: { Authorization: getAuthorization(), "Content-Type": "application/json" },
    });
    taskId = response.data?.request_id;
    if (!taskId) throw new Error(getErrorMessage(response.data, "未返回任务 ID"));
  } catch (error: any) {
    throw new Error(`视频任务创建失败: ${getErrorMessage(error?.response?.data, error?.message || "未知错误")}`);
  }

  logger(`视频任务 ID: ${taskId}`);
  const result = await pollTask(async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/videos/${encodeURIComponent(taskId)}`, {
        headers: { Authorization: getAuthorization() },
      });
      const data = response.data;
      const status = String(data?.status || "").toLowerCase();
      logger(`视频任务状态: ${status || "unknown"}`);

      if (["done", "completed", "succeeded", "success"].includes(status)) {
        return { completed: true, data: data?.video?.url };
      }
      if (["failed", "failure", "error", "cancelled"].includes(status)) {
        return { completed: true, error: getErrorMessage(data, "视频生成失败") };
      }
      return { completed: false };
    } catch (error: any) {
      return { completed: true, error: getErrorMessage(error?.response?.data, error?.message || "视频任务查询失败") };
    }
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) throw new Error("视频任务完成但未返回视频地址");
  return await urlToBase64(result.data);
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: vendor.version, notice: "当前为本地适配版本" };
};

const updateVendor = async (): Promise<string> => {
  return "";
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
