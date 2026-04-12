/**
 * cli-proxy-api 供应商适配
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
  id: "cpa",
  version: "2.0",
  author: "四零二二",
  name: "cli-proxy-api接口",
  description: "支持所有兼容CPA中openai接口规范的API，仅支持文本\n\n欢迎使用我的其他插件：https://tf.4022543.xyz",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "url", required: true, placeholder: "默认 https://127.0.0.1:8317/v1" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://127.0.0.1:8317/v1",
  },
  models: [
    { name: "qwen3-coder-plus", type: "text", modelName: "qwen3-coder-plus", think: true },
    { name: "qwen3-coder-flash", type: "text", modelName: "qwen3-coder-flash", think: true },
    { name: "图片识别vision-model", type: "text", modelName: "vision-model", think: true },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getApiKey = () => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  return vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  const apiKey = getApiKey();
  return createOpenAI({
    baseURL: vendor.inputValues.baseUrl,
    apiKey,
  }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  throw new Error("图片功能暂未支持");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  throw new Error("视频功能暂未支持");
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  throw new Error("TTS功能暂未支持");
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
    const remoteVendorUrl = "https://tf.4022543.xyz/store/openai/cpa.ts";
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
