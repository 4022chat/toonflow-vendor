/**
 * 即梦 CLI 本地服务供应商适配
 * @version 2.0
 */

// ============================================================
// 类型定义
// ============================================================

type VideoMode =
  | "singleImage" //单图参考
  | "startEndRequired" //首尾帧（两张都得有）
  | "endFrameOptional" //首尾帧（尾帧可选）
  | "startFrameOptional" //首尾帧（首帧可选）
  | "text" //文本
  | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[]; //多参考（数字代表限制数量）

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
declare const FormData: any;
declare const Buffer: any;
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
  id: "dreamina2api",
  version: "2.0",
  author: "四零二二",
  name: "即梦 CLI",
  description: "对接本地即梦CLI生成服务，支持图片生成、图片编辑及异步视频生成。\n\n 需要搭配DreamQueue软件才可使用。[查看详情](https://my.feishu.cn/wiki/TXE1wM0PfiDtRzkbWrocRibJnud)",
  inputs: [
    { key: "apiKey", label: "API 密钥", type: "password", required: true, placeholder: "默认：sk-jm-local" },
    { key: "baseUrl", label: "服务地址", type: "url", required: true, placeholder: "例如：http://127.0.0.1:3000" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "http://127.0.0.1:3000",
  },
  models: [
    {
      name: "Seedance 2.0 VIP",
      modelName: "seedance2.0_vip",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      audio: true,
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p", "4k"] }],
    },
    {
      name: "Seedance 2.0 Fast VIP",
      modelName: "seedance2.0fast_vip",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      audio: true,
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p"] }],
    },
    {
      name: "Seedance 2.0 Mini",
      modelName: "seedance2.0mini",
      type: "video",
      mode: ["text", "singleImage"],
      audio: false,
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p"] }],
    },
    {
      name: "Seedance 2.5",
      modelName: "seedance2.5",
      type: "video",
      mode: ["text", "singleImage"],
      audio: false,
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], resolution: ["480p", "720p", "1080p"] }],
    },
    { name: "即梦图片 4.0", modelName: "4.0", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 4.1", modelName: "4.1", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 4.5", modelName: "4.5", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 4.6", modelName: "4.6", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 4.7", modelName: "4.7", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 5.0", modelName: "5.0", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "即梦图片 5.0 Pro", modelName: "5.0Pro", type: "image", mode: ["text", "singleImage", "multiReference"] },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => {
  const baseUrl = vendor.inputValues.baseUrl.trim().replace(/\/+$/, "");
  if (!baseUrl) throw new Error("缺少服务地址");
  return baseUrl;
};

const getApiKey = () => {
  const apiKey = vendor.inputValues.apiKey.trim().replace(/^Bearer\s+/i, "");
  if (!apiKey) throw new Error("缺少 API 密钥");
  return apiKey;
};

const getHeaders = () => ({ Authorization: `Bearer ${getApiKey()}` });

const getErrorMessage = (error: any) =>
  error?.response?.data?.error?.message ||
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  "未知错误";

const getBase64File = (value: string, type: ReferenceList["type"], index: number) => {
  const match = value.match(/^data:([^;,]+);base64,(.+)$/);
  const mimeType = match?.[1] || (type === "image" ? "image/png" : type === "video" ? "video/mp4" : "audio/mpeg");
  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/webm": "webm",
    "audio/wav": "wav",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
    "audio/flac": "flac",
    "audio/ogg": "ogg",
  };
  return {
    data: Buffer.from(match?.[2] || value, "base64"),
    filename: `${type}-${index + 1}.${extensionMap[mimeType] || "bin"}`,
    mimeType,
  };
};

const appendReference = (formData: any, field: string, reference: ReferenceList, index: number) => {
  const file = getBase64File(reference.base64, reference.type, index);
  formData.append(field, file.data, { filename: file.filename, contentType: file.mimeType });
};

const getImageResolution = (modelName: string, size: ImageConfig["size"]) => {
  const requestedResolution = size.toLowerCase();
  if (modelName === "5.0Pro" && requestedResolution === "1k") return "1.5k";
  if (["3.0", "3.1"].includes(modelName) && requestedResolution === "4k") return "2k";
  if (modelName !== "5.0Pro" && !["3.0", "3.1"].includes(modelName) && requestedResolution === "1k") return "2k";
  return requestedResolution;
};

const getImageResult = async (data: any): Promise<string> => {
  const result = data?.data?.[0];
  if (typeof result?.b64_json === "string" && result.b64_json.length > 0) {
    return result.b64_json.startsWith("data:") ? result.b64_json : `data:image/png;base64,${result.b64_json}`;
  }
  if (typeof result?.url === "string" && result.url.length > 0) {
    const resultUrl = result.url.startsWith("http://") || result.url.startsWith("https://")
      ? result.url
      : `${getBaseUrl()}${result.url.startsWith("/") ? result.url : `/${result.url}`}`;
    return urlToBase64(resultUrl);
  }
  throw new Error(`图片生成完成，但接口未返回图片数据: ${JSON.stringify(data)}`);
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  throw new Error("即梦 CLI 供应商不支持文本请求");
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const baseUrl = getBaseUrl();
  const headers = getHeaders();
  const references = config.referenceList ?? [];
  const imageResolution = getImageResolution(model.modelName, config.size);

  if (!config.prompt.trim()) throw new Error("图片提示词不能为空");
  if (references.length > 10) throw new Error("图片参考图最多支持 10 张");
  if (references.length > 0 && ["3.0", "3.1"].includes(model.modelName)) {
    throw new Error(`${model.name} 不支持参考图生成`);
  }

  try {
    logger(`提交即梦图片${references.length > 0 ? "编辑" : "生成"}任务，模型: ${model.modelName}`);
    if (references.length === 0) {
      const response = await axios.post(`${baseUrl}/v1/images/generations`, {
        model: model.modelName,
        prompt: config.prompt,
        ratio: config.aspectRatio,
        n: 1,
        format: "png",
        resolution_type: imageResolution,
        response_format: "b64_json",
      }, { headers: { ...headers, "Content-Type": "application/json" } });
      return getImageResult(response.data);
    }

    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("n", "1");
    formData.append("format", "png");
    formData.append("resolution_type", imageResolution);
    formData.append("response_format", "b64_json");
    references.forEach((reference, index) => appendReference(formData, "image", reference, index));

    const response = await axios.post(`${baseUrl}/v1/images/edits`, formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    return getImageResult(response.data);
  } catch (error) {
    throw new Error(`即梦图片请求失败: ${getErrorMessage(error)}`);
  }
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const headers = { Authorization: `Bearer ${apiKey}` };
  const references = config.referenceList ?? [];
  const images = references.filter((reference) => reference.type === "image");
  const videos = references.filter((reference) => reference.type === "video");
  const audios = references.filter((reference) => reference.type === "audio");
  const isStartEndMode = config.mode.includes("startEndRequired") || config.mode.includes("endFrameOptional") || config.mode.includes("startFrameOptional");
  const isSingleImageMode = config.mode.includes("singleImage") && !isStartEndMode;
  const isMultiReferenceMode = config.mode.some((mode) => Array.isArray(mode));

  if (!config.prompt.trim()) throw new Error("视频提示词不能为空");
  if (images.length > 9) throw new Error("视频生成最多支持 9 张参考图");
  if (videos.length > 3) throw new Error("视频生成最多支持 3 个参考视频");
  if (audios.length > 3) throw new Error("视频生成最多支持 3 个参考音频");
  if (isStartEndMode && (images.length !== 2 || videos.length > 0 || audios.length > 0)) {
    throw new Error("首尾帧模式需要且仅支持 2 张参考图");
  }
  if (isSingleImageMode && (images.length !== 1 || videos.length > 0 || audios.length > 0)) {
    throw new Error("单图模式需要且仅支持 1 张参考图");
  }
  if (isMultiReferenceMode && references.length === 0) throw new Error("多模态参考模式至少需要 1 个参考文件");

  try {
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("duration", String(config.duration));
    formData.append("ratio", config.aspectRatio);
    formData.append("video_resolution", config.resolution);
    if (isStartEndMode) formData.append("video_mode", "frames2video");
    else if (isSingleImageMode) formData.append("video_mode", "image2video");
    else if (isMultiReferenceMode) formData.append("video_mode", "multimodal2video");

    images.forEach((reference, index) => appendReference(formData, "image", reference, index));
    videos.forEach((reference, index) => appendReference(formData, "video", reference, index));
    audios.forEach((reference, index) => appendReference(formData, "audio", reference, index));

    logger(`提交即梦视频任务，模型: ${model.modelName}`);
    const createResponse = await axios.post(`${baseUrl}/v1/video/generations`, formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    const queueId = createResponse.data?.queue_id || createResponse.data?.id;
    if (!queueId) throw new Error(`接口未返回任务 ID: ${JSON.stringify(createResponse.data)}`);

    logger(`即梦视频任务已创建: ${queueId}`);
    await axios.post(`${baseUrl}/v1/tasks/${encodeURIComponent(queueId)}/start`, undefined, { headers });

    const result = await pollTask(async () => {
      const queryResponse = await axios.get(`${baseUrl}/v1/tasks/${encodeURIComponent(queueId)}`, { headers });
      const task = queryResponse.data;
      const status = String(task?.status || "").toLowerCase();
      logger(`即梦视频任务状态: ${status || "unknown"}`);

      if (["success", "completed", "succeeded"].includes(status)) {
        const resultUrl = task?.data?.find((item: any) => typeof item?.url === "string" && item.url.length > 0)?.url;
        const fallbackUrl = `${baseUrl}/v1/videos/${encodeURIComponent(queueId)}/content?api_key=${encodeURIComponent(apiKey)}`;
        return { completed: true, data: resultUrl || fallbackUrl };
      }
      if (["failed", "failure", "error", "cancelled"].includes(status)) {
        return { completed: true, error: task?.error?.message || task?.error || "视频生成失败" };
      }
      return { completed: false };
    }, 5000, 60 * 60 * 1000);

    if (result.error) throw new Error(result.error);
    if (!result.data) throw new Error("视频任务完成，但接口未返回视频地址");
    logger("即梦视频生成完成，正在转换为 Base64");
    return await urlToBase64(result.data);
  } catch (error) {
    throw new Error(`即梦视频请求失败: ${getErrorMessage(error)}`);
  }
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
    const remoteVendorUrl = `https://tf.kaipai.vip/store/jimeng/${vendor.id}.ts`;
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
export { };
