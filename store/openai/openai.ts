/**
 * OpenAI 官方接口 供应商适配
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
  id: "openai",
  version: "2.0",
  author: "四零二二",
  name: "OpenAI 官方接口",
  description: "支持所有兼容 OpenAI 官方接口规范的API，支持文本、图像、视频和语音能力。\n\n欢迎使用我的其他插件：https://tf.4022543.xyz",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "url", required: true, placeholder: "默认 https://api.openai.com/v1" },
    { key: "text", label: "文本接口地址", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/chat/completions" },
    { key: "image", label: "图片生成地址", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/images/generations" },
    { key: "imageEdit", label: "图片编辑地址", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/images/edits" },
    { key: "videoCreate", label: "视频任务创建", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/videos" },
    { key: "videoQuery", label: "视频任务查询", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/videos/{id}" },
    { key: "videoDownload", label: "视频文件下载", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/videos/{id}/content" },
    { key: "tts", label: "语音合成地址", type: "url", required: false, placeholder: "默认为空，系统会自动拼接，如： https://api.openai.com/v1/audio/speech" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://api.openai.com/v1",
    text: "",
    image: "",
    imageEdit: "",
    videoCreate: "",
    videoQuery: "",
    videoDownload: "",
    tts: "",
  },
  models: [
    { name: "GPT-5.4", type: "text", modelName: "gpt-5.4", think: true },
    { name: "GPT-5.4 Mini", type: "text", modelName: "gpt-5.4-mini", think: true },
    { name: "GPT-5.4 Nano", type: "text", modelName: "gpt-5.4-nano", think: true },
    { name: "GPT Image 1.5", type: "image", modelName: "gpt-image-1.5", mode: ["text", "singleImage", "multiReference"] },
    { name: "GPT Image 1", type: "image", modelName: "gpt-image-1", mode: ["text", "singleImage", "multiReference"] },
    { name: "GPT Image 1-mini", type: "image", modelName: "gpt-image-1-mini", mode: ["text", "singleImage", "multiReference"] },
    {
      name: "Sora-2",
      type: "video",
      modelName: "sora-2",
      mode: ["singleImage", "text"],
      audio: "optional",
      durationResolutionMap: [{ duration: [4, 8, 12], resolution: ["720x1280", "1280x720", "1024x1792", "1792x1024"] }],
    },
    {
      name: "sora-2-pro",
      type: "video",
      modelName: "sora-2-pro",
      mode: ["singleImage", "text"],
      audio: "optional",
      durationResolutionMap: [{ duration: [4, 8, 12], resolution: ["720x1280", "1280x720", "1024x1792", "1792x1024"] }],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const defaultBaseUrl = "https://api.openai.com/v1";

const buildApiUrl = (baseUrl: string | undefined, path: string) => {
  const url = stripTrailingSlash(baseUrl) || `${defaultBaseUrl}${path}`;
  return url;
};

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

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  const apiKey = getApiKey();
  return createOpenAI({
    baseURL: buildApiUrl(vendor.inputValues.text, ""),
    apiKey,
  }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const apiKey = getApiKey();
  const headers = { Authorization: `Bearer ${apiKey}` };
  const imageRefs = (config.referenceList ?? []).map((r) => r.base64);

  if (imageRefs.length > 0) {
    const body = new FormData();
    body.append("model", model.modelName);
    body.append("prompt", config.prompt);
    body.append("size", getImageSize(config.aspectRatio));

    imageRefs.forEach((item, index) => {
      const { mime, base64 } = parseBase64(item);
      body.append("image", Buffer.from(base64, "base64"), {
        filename: `image-${index}.${getImageExtension(mime)}`,
        contentType: mime,
      });
    });

    const response = await axios.post(buildApiUrl(vendor.inputValues.imageEdit, "/images/edits"), body, {
      headers: { ...headers, ...(typeof body.getHeaders === "function" ? body.getHeaders() : {}) },
    });
    const data = response.data;
    return data?.data?.[0]?.b64_json || data?.data?.[0]?.url;
  }

  const response = await fetch(buildApiUrl(vendor.inputValues.image, "/images/generations"), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model.modelName,
      prompt: config.prompt,
      size: getImageSize(config.aspectRatio),
    }),
  });
  await ensureSuccess(response);
  const data = await response.json();
  return data?.data?.[0]?.b64_json || data?.data?.[0]?.url;
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const apiKey = getApiKey();
  const createUrl = buildApiUrl(vendor.inputValues.videoCreate, "/videos/create");
  const queryUrl = buildApiUrl(vendor.inputValues.videoQuery, "/videos/{id}");
  const downloadUrl = buildApiUrl(vendor.inputValues.videoDownload, "/videos/{id}/content");
  const size = getVideoSize(config.resolution, config.aspectRatio);

  const body = new FormData();
  body.append("model", model.modelName);
  body.append("prompt", config.prompt);
  body.append("seconds", String(config.duration));
  body.append("size", size);

  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);
  if (imageRefs.length > 0) {
    const [width, height] = size.split("x").map(Number);
    const resizedBase64 = await zipImageResolution(imageRefs[0], width, height);
    const { mime, base64 } = parseBase64(resizedBase64);
    body.append("input_reference", Buffer.from(base64, "base64"), {
      filename: `reference.${getImageExtension(mime)}`,
      contentType: mime,
    });
  }

  const response = await axios.post(createUrl, body, {
    headers: { Authorization: `Bearer ${apiKey}`, ...(typeof body.getHeaders === "function" ? body.getHeaders() : {}) },
  });
  const taskId = response.data?.id;
  if (!taskId) throw new Error(`任务提交失败: ${JSON.stringify(response.data || {})}`);

  const result = await pollTask(async () => {
    const queryResponse = await fetch(queryUrl.replace("{id}", taskId), {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    await ensureSuccess(queryResponse);

    const queryData = await queryResponse.json();
    const status = String(queryData?.status || "").toLowerCase();
    if (status === "completed") {
      const downloadResponse = await fetch(downloadUrl.replace("{id}", taskId), {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      await ensureSuccess(downloadResponse);
      const buffer = Buffer.from(await downloadResponse.arrayBuffer());
      return { completed: true, data: buffer.toString("base64") };
    }
    if (status === "failed" || status === "cancelled") {
      return { completed: true, error: queryData?.error?.message || "视频生成失败" };
    }
    return { completed: false };
  });

  if (result.error) throw new Error(result.error);
  return result.data!;
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  const apiKey = getApiKey();
  const response = await fetch(buildApiUrl(vendor.inputValues.tts, "/audio/speech"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.modelName,
      input: config.text,
      voice: config.voice,
      response_format: "mp3",
      instructions: buildSpeechInstructions(config),
    }),
  });
  await ensureSuccess(response);
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
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
    const remoteVendorUrl = `https://tf.4022543.xyz/store/${vendor.id}/${vendor.id}.ts`;
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
