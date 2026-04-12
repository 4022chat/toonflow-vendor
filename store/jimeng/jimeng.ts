/**
 * JM-API 供应商适配
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
  id: "jimeng",
  version: "2.0",
  author: "四零二二",
  name: "JM-API",
  description:
    "兼容JM2API项目的接口，支持文生图、图生图、普通视频与 SD2.0 多模态视频生成。\n\n 使用该方案，您需要先拥有一个JM的API服务，才能使用该适配器。\n\n 可以在github上搜索：例如：[jimeng-free-api-all](https://github.com/wwwzhouhui/jimeng-free-api-all)\n\n⚠️**警告：此类项目有违官方使用规则，该方案有可能会被封号，请慎重！！！建议使用官方接口。**\n\n更多供应商：https://tf.4022543.xyz/",
  inputs: [
    { key: "apiKey", label: "SessionID / API密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "url", required: true, placeholder: "例如 http://127.0.0.1:8000" },
    { key: "image", label: "图片接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/images/generations" },
    { key: "video", label: "视频接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/videos/generations/async" },
    { key: "videoQuery", label: "通用视频任务查询", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/videos/generations/async/{id}" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "http://127.0.0.1:8000",
    image: "",
    video: "",
    videoQuery: "",
  },
  models: [
    {
      name: "jm 5.0",
      type: "image",
      modelName: "jimeng-5.0",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "jm 4.6",
      type: "image",
      modelName: "jimeng-4.6",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "jm 4.5",
      type: "image",
      modelName: "jimeng-4.5",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "jm 4.1",
      type: "image",
      modelName: "jimeng-4.1",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "jm 4.0",
      type: "image",
      modelName: "jimeng-4.0",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "SD 2.0",
      type: "video",
      modelName: "jimeng-video-seedance-2.0",
      mode: [
        "singleImage",
        "startEndRequired",
        "endFrameOptional",
        "startFrameOptional",
        "text",
        ["videoReference:1", "imageReference:9", "audioReference:1"],
      ],
      associationSkills: "",
      audio: true,
      durationResolutionMap: [
        {
          duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          resolution: ["720p", "1080p"],
        },
      ],
    },
    {
      name: "SD 2.0 Fast",
      modelName: "jimeng-video-seedance-2.0-fast",
      type: "video",
      mode: [
        "singleImage",
        "startEndRequired",
        "endFrameOptional",
        "startFrameOptional",
        "text",
        ["videoReference:9", "imageReference:9", "audioReference:3"],
      ],
      associationSkills: "",
      audio: true,
      durationResolutionMap: [
        {
          duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          resolution: ["720p", "1080p"],
        },
      ],
    },
    {
      name: "SD 2.0 VIP",
      type: "video",
      modelName: "jimeng-video-seedance-2.0-vip",
      mode: [
        "singleImage",
        "startEndRequired",
        "endFrameOptional",
        "startFrameOptional",
        "text",
        ["videoReference:9", "imageReference:9", "audioReference:3"],
      ],
      associationSkills: "",
      audio: true,
      durationResolutionMap: [
        {
          duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          resolution: ["720p", "1080p"],
        },
      ],
    },
    {
      name: "SD 2.0 Fast VIP",
      modelName: "jimeng-video-seedance-2.0-fast-vip",
      type: "video",
      mode: [
        "singleImage",
        "startEndRequired",
        "endFrameOptional",
        "startFrameOptional",
        "text",
        ["videoReference:9", "imageReference:9", "audioReference:3"],
      ],
      associationSkills: "",
      audio: true,
      durationResolutionMap: [
        {
          duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          resolution: ["720p", "1080p"],
        },
      ],
    },
    {
      name: "SD 1.5",
      modelName: "jimeng-video-3.5-pro",
      type: "video",
      mode: ["text", "startEndRequired"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [5, 10, 12],
          resolution: ["720p", "1080p"],
        },
      ],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");
const getImageUrl = () => vendor.inputValues.image || `${getBaseUrl()}/v1/images/generations`;
const getVideoUrl = () => vendor.inputValues.video || `${getBaseUrl()}/v1/videos/generations/async`;
const getVideoQueryUrl = () => vendor.inputValues.videoQuery || `${getBaseUrl()}/v1/videos/generations/async/{id}`;

const getAuthorization = () => {
  if (!vendor.inputValues.apiKey) throw new Error("未填写 SessionID / API密钥");
  return vendor.inputValues.apiKey.startsWith("Bearer ") ? vendor.inputValues.apiKey : `Bearer ${vendor.inputValues.apiKey}`;
};

const normalizeBase64 = (completeBase64: string) => completeBase64.replace(/^data:[^;]+;base64,/, "");

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

const appendBase64Files = (formData: any, fieldName: string, files: string[], filenamePrefix: string) => {
  files.forEach((file, index) => {
    const meta = getFileMeta(file, `${filenamePrefix}-${index + 1}`);
    formData.append(fieldName, Buffer.from(normalizeBase64(file), "base64"), {
      filename: meta.filename,
      contentType: meta.mimeType,
    });
  });
};

const extractResult = (data: any): string | undefined => {
  const candidates = [
    data?.data?.[0]?.url,
    data?.data?.[0]?.b64_json,
    data?.data?.[0]?.video_url,
    data?.data?.url,
    data?.data?.b64_json,
    data?.data?.result_url,
    data?.url,
    data?.b64_json,
    data?.result_url,
    data?.video_url,
  ];
  return candidates.find((item) => typeof item === "string" && item.length > 0);
};

const parseJsonResponse = async (response: any) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`接口返回了非 JSON 内容: ${text}`);
  }
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  throw new Error("不支持文本请求，可以更换其他供应商");
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const headers = { Authorization: getAuthorization() };
  const imageRefs = (config.referenceList ?? []).map((r) => r.base64);
  const hasImages = imageRefs.length > 0;

  let resolution = config.size.toLowerCase();
  if (resolution === "1k") {
    resolution = "2k";
  }

  if (hasImages) {
    const images = imageRefs.map((base64) => {
      const normalized = normalizeBase64(base64);
      const meta = getFileMeta(base64, "image");
      return `data:${meta.mimeType};base64,${normalized}`;
    });

    logger(`[imageRequest] 提交图生图任务，模型: ${model.modelName}`);
    const response = await fetch(getImageUrl(), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.modelName,
        prompt: config.prompt,
        ratio: config.aspectRatio,
        resolution,
        response_format: "url",
        sample_strength: 0.5,
        images,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`图片请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }

    const data = await parseJsonResponse(response);
    const result = extractResult(data);
    if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
    return result;
  }

  logger(`[imageRequest] 提交文生图任务，模型: ${model.modelName}`);
  const response = await fetch(getImageUrl(), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model.modelName,
      prompt: config.prompt,
      ratio: config.aspectRatio,
      resolution,
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`图片请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
  }

  const data = await parseJsonResponse(response);
  const result = extractResult(data);
  if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
  return result;
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const headers = { Authorization: getAuthorization() };

  const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);
  const videoRefs = (config.referenceList ?? []).filter((r) => r.type === "video").map((r) => r.base64);
  const audioRefs = (config.referenceList ?? []).filter((r) => r.type === "audio").map((r) => r.base64);
  const allRefs = [...imageRefs, ...videoRefs, ...audioRefs];
  const hasFiles = allRefs.length > 0;

  let taskId: string;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("model", model.modelName);
    if (config.prompt) formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("resolution", config.resolution);
    formData.append("duration", String(config.duration));
    appendBase64Files(formData, "files", allRefs, "material");

    logger(`[videoRequest] 提交视频任务（含参考文件），模型: ${model.modelName}`);
    const response = await axios.post(getVideoUrl(), formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    const data = response.data;
    taskId = data?.task_id ?? data?.taskId ?? data?.id;
    if (!taskId) throw new Error(`视频任务提交失败: ${JSON.stringify(data)}`);
  } else {
    logger(`[videoRequest] 提交文本生视频任务，模型: ${model.modelName}`);
    const response = await fetch(getVideoUrl(), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.modelName,
        prompt: config.prompt,
        ratio: config.aspectRatio,
        resolution: config.resolution,
        duration: config.duration,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`视频请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }

    const data = await parseJsonResponse(response);
    taskId = data?.task_id ?? data?.taskId ?? data?.id;
    if (!taskId) throw new Error(`视频任务提交失败: ${JSON.stringify(data)}`);
  }

  logger(`[videoRequest] 任务ID: ${taskId}，开始轮询`);
  const queryUrl = getVideoQueryUrl();
  const res = await pollTask(async () => {
    const queryResponse = await fetch(queryUrl.replace("{id}", taskId), {
      method: "GET",
      headers: { ...headers, "Content-Type": "application/json" },
    });

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();
      throw new Error(`查询任务失败，状态码: ${queryResponse.status}, 错误信息: ${errorText}`);
    }

    const queryData = await parseJsonResponse(queryResponse);
    const status = queryData?.status;

    switch (status) {
      case "succeeded":
      case "completed":
      case "SUCCESS":
      case "success": {
        const result = extractResult(queryData);
        if (result) {
          return { completed: true, data: result };
        }
        const url = queryData?.data?.[0]?.url ?? queryData?.data?.url ?? queryData?.result_url;
        if (url) {
          return { completed: true, data: url };
        }
        return { completed: false };
      }
      case "failed":
      case "FAILURE":
      case "failure": {
        const errorMsg = queryData?.error ?? queryData?.data?.error ?? queryData?.message ?? "视频生成失败";
        return { completed: true, error: errorMsg };
      }
      case "processing":
      case "pending":
      default:
        return { completed: false };
    }
  });

  if (res.error) throw new Error(res.error);
  if (!res.data) throw new Error("视频生成超时或返回结果为空");
  return res.data;
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
