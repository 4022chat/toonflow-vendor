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
  negativePrompt?: string;
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

// ============================================================
// 全局声明
// ============================================================

declare const axios: any;
declare const logger: (msg: string) => void;
declare const urlToBase64: (url: string) => Promise<string>;
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
    "兼容JM2API项目的接口，支持文生图、图生图、普通视频与 SD2.0 多模态视频生成。\n\n 使用该方案，您需要先拥有一个JM的API服务，才能使用该适配器。\n\n 可以在github上搜索：例如：[jimeng-free-api-all](https://github.com/zhizinan1997/jimeng-free-api-all)\n\n⚠️**警告：此类项目有违官方使用规则，该方案有可能会被封号，请慎重！！！建议使用官方接口。**\n\n更多供应商：https://tf.kaipai.vip/",
  inputs: [
    { key: "apiKey", label: "API 密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "url", required: true, placeholder: "例如 http://127.0.0.1:8000" },
    { key: "image", label: "图片接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/images/generations" },
    { key: "video", label: "视频接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/videos/generations" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "http://127.0.0.1:8000",
    image: "",
    video: "",
  },
  models: [
    {
      name: "图片 5.0 Pro",
      type: "image",
      modelName: "jimeng-image-5.0-pro",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 5.0 Lite",
      type: "image",
      modelName: "jimeng-image-5.0-lite",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 4.7",
      type: "image",
      modelName: "jimeng-image-4.7",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 4.6",
      type: "image",
      modelName: "jimeng-image-4.6",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 4.5",
      type: "image",
      modelName: "jimeng-image-4.5",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 4.1",
      type: "image",
      modelName: "jimeng-image-4.1",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 4.0",
      type: "image",
      modelName: "jimeng-image-4.0",
      mode: ["text", "singleImage", "multiReference"],
      associationSkills: "",
    },
    {
      name: "图片 3.1",
      type: "image",
      modelName: "jimeng-image-3.1",
      mode: ["text", "singleImage"],
      associationSkills: "",
    },
    {
      name: "图片 3.0",
      type: "image",
      modelName: "jimeng-image-3.0",
      mode: ["text", "singleImage"],
      associationSkills: "",
    },
    {
      name: "Seedance 2.0",
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
          duration: [10],
          resolution: ["720p"],
        },
      ],
    },
    {
      name: "Seedance 2.0 Fast VIP",
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
          duration: [10],
          resolution: ["720p"],
        },
      ],
    },
    {
      name: "Seedance 2.0 VIP",
      type: "video",
      modelName: "jimeng-video-seedance-2.0-pro",
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
          duration: [10],
          resolution: ["720p", "1080p", "4k"],
        },
      ],
    },
    {
      name: "Seedance 2.5",
      modelName: "jimeng-video-seedance-2.5",
      type: "video",
      mode: ["text", "singleImage"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [10],
          resolution: ["720p"],
        },
      ],
    },
    {
      name: "Seedance 2.0 Mini",
      modelName: "jimeng-video-seedance-2.0-mini",
      type: "video",
      mode: ["text", "singleImage"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [10],
          resolution: ["720p"],
        },
      ],
    },
    {
      name: "Seedance 1.5 Pro",
      modelName: "jimeng-video-seedance-1.5-pro",
      type: "video",
      mode: ["text", "singleImage"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [10],
          resolution: ["720p"],
        },
      ],
    },
    {
      name: "Seedance 1.0",
      modelName: "jimeng-video-3.0-pro",
      type: "video",
      mode: ["text", "singleImage"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [10],
          resolution: ["1080p"],
        },
      ],
    },
    {
      name: "Seedance 1.0 Fast",
      modelName: "jimeng-video-3.0-fast",
      type: "video",
      mode: ["text", "singleImage"],
      associationSkills: "",
      audio: false,
      durationResolutionMap: [
        {
          duration: [10],
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
const getVideoUrl = () => vendor.inputValues.video || `${getBaseUrl()}/v1/videos/generations`;

const imageResolutions: Record<string, string[]> = {
  "jimeng-image-5.0-pro": ["4k", "2k", "1.5k"],
  "jimeng-image-5.0-lite": ["4k", "2k"],
  "jimeng-image-4.7": ["4k", "2k"],
  "jimeng-image-4.6": ["4k", "2k"],
  "jimeng-image-4.5": ["4k", "2k"],
  "jimeng-image-4.1": ["4k", "2k"],
  "jimeng-image-4.0": ["4k", "2k"],
  "jimeng-image-3.1": ["2k", "1k"],
  "jimeng-image-3.0": ["2k", "1k"],
  "jimeng-image-2.0-pro": ["1k"],
};

const getAuthorization = () => {
  if (!vendor.inputValues.apiKey) throw new Error("未填写 SessionID / API密钥");
  return /^Bearer\s+/i.test(vendor.inputValues.apiKey) ? vendor.inputValues.apiKey : `Bearer ${vendor.inputValues.apiKey}`;
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

const extractResult = (data: any): { value: string; isUrl: boolean } | undefined => {
  const candidates = [
    { value: data?.data?.[0]?.url, isUrl: true },
    { value: data?.data?.[0]?.b64_json, isUrl: false },
    { value: data?.data?.[0]?.video_url, isUrl: true },
    { value: data?.data?.url, isUrl: true },
    { value: data?.data?.b64_json, isUrl: false },
    { value: data?.data?.result_url, isUrl: true },
    { value: data?.url, isUrl: true },
    { value: data?.b64_json, isUrl: false },
    { value: data?.result_url, isUrl: true },
    { value: data?.video_url, isUrl: true },
  ];
  return candidates.find((candidate) => typeof candidate.value === "string" && candidate.value.length > 0);
};

const toBase64Result = async (result: { value: string; isUrl: boolean }, mimeType: string) => {
  if (result.isUrl) return urlToBase64(result.value);
  return result.value.startsWith("data:") ? result.value : `data:${mimeType};base64,${result.value}`;
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

const getImageResolution = (modelName: string, size: ImageConfig["size"]) => {
  const requestedResolution = size.toLowerCase();
  const supportedResolutions = imageResolutions[modelName] || ["1k"];

  if (modelName === "jimeng-image-5.0-pro" && requestedResolution === "1k") {
    return "1.5k";
  }
  if (requestedResolution === "1k" && supportedResolutions.includes("2k")) {
    return "2k";
  }
  if (supportedResolutions.includes(requestedResolution)) return requestedResolution;
  if (supportedResolutions.includes("2k")) return "2k";
  return "1k";
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const resolution = getImageResolution(model.modelName, config.size);
  const authorization = getAuthorization();
  const references = config.referenceList ?? [];
  let response: any;

  logger(`[imageRequest] 提交图片生成请求，模型: ${model.modelName}`);
  if (references.length === 0) {
    response = await fetch(getImageUrl(), {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.modelName,
        prompt: config.prompt,
        negative_prompt: config.negativePrompt,
        ratio: config.aspectRatio,
        resolution,
        response_format: "url",
      }),
    });
  } else {
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    if (config.negativePrompt) formData.append("negative_prompt", config.negativePrompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("resolution", resolution);
    formData.append("response_format", "url");
    appendBase64Files(formData, "image", [references[0].base64], "reference");

    response = await axios.post(getImageUrl(), formData, {
      headers: { Authorization: authorization, ...formData.getHeaders?.() },
      validateStatus: () => true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`图片请求失败，状态码: ${response.status}, 错误信息: ${JSON.stringify(response.data)}`);
    }
    const result = extractResult(response.data);
    if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(response.data)}`);
    return await toBase64Result(result, "image/png");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`图片请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
  }
  const data = await parseJsonResponse(response);
  const result = extractResult(data);
  if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
  return await toBase64Result(result, "image/png");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const authorization = getAuthorization();
  const references = config.referenceList ?? [];
  let data: any;

  logger(`[videoRequest] 提交视频生成请求，模型: ${model.modelName}`);
  if (references.length === 0) {
    const response = await fetch(getVideoUrl(), {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.modelName,
        prompt: config.prompt,
        ratio: config.aspectRatio,
        resolution: config.resolution,
        duration: config.duration,
        response_format: "url",
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`视频请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }
    data = await parseJsonResponse(response);
  } else {
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("resolution", config.resolution);
    formData.append("duration", String(config.duration));
    formData.append("response_format", "url");
    appendBase64Files(formData, "file", references.map((reference) => reference.base64), "reference");

    const response = await axios.post(getVideoUrl(), formData, {
      headers: { Authorization: authorization, ...formData.getHeaders?.() },
      validateStatus: () => true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`视频请求失败，状态码: ${response.status}, 错误信息: ${JSON.stringify(response.data)}`);
    }
    data = response.data;
  }

  const result = extractResult(data);
  if (!result) throw new Error(`视频生成成功但未返回可用结果: ${JSON.stringify(data)}`);
  return await toBase64Result(result, "video/mp4");
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
    const remoteVendorUrl = `https://tf.kaipai.vip/store/${vendor.id}/${vendor.id}.ts`;
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
