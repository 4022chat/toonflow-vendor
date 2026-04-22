/**
 * Toonflow AI供应商模板
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

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "qiniu",
  version: "2.0",
  author: "四零二二",
  name: "七牛云大模型推理服务",
  description: "支持七牛云大模型推理服务的 OpenAI 兼容文本模型与 Kling 系列图片生成模型。\n\n欢迎使用我的其他插件：https://tf.4022543.xyz",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "示例：https://api.qnaigc.com/v1" },
  ],
  inputValues: { apiKey: "", baseUrl: "https://api.qnaigc.com/v1" },
  models: [
    { name: "Kimi K2.5", modelName: "moonshotai/kimi-k2.5", type: "text", think: false },
    { name: "GLM-5", modelName: "z-ai/glm-5", type: "text", think: false },
    { name: "Mimo V2 Flash", modelName: "xiaomi/mimo-v2-flash", type: "text", think: false },
    { name: "LongCat Flash Lite", modelName: "meituan/longcat-flash-lite", type: "text", think: false },
    { name: "DeepSeek V3.2 251201", modelName: "deepseek/deepseek-v3.2-251201", type: "text", think: false },
    { name: "Kling V1.5", modelName: "kling-v1-5", type: "image", mode: ["text", "singleImage"] },
    { name: "Kling V2", modelName: "kling-v2", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "Kling V2 New", modelName: "kling-v2-new", type: "image", mode: ["singleImage", "multiReference"] },
    { name: "Kling V2.1", modelName: "kling-v2-1", type: "image", mode: ["text", "singleImage", "multiReference"] },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");

const getApiKey = () => {
  if (!vendor.inputValues.apiKey) {
    throw new Error("缺少API Key");
  }
  return vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
};

const getAuthorization = () => `Bearer ${getApiKey()}`;

const parseAspectRatio = (aspectRatio: string) => {
  const supportedAspectRatios = ["16:9", "9:16", "1:1", "4:3", "3:4", "3:2", "2:3", "21:9"];
  if (supportedAspectRatios.includes(aspectRatio)) {
    return aspectRatio;
  }
  return "16:9";
};

const normalizeBase64 = (base64: string) => base64.replace(/^data:[^;]+;base64,/, "");

const extractImageUrl = (data: any): string | undefined => {
  const candidates = [
    data?.data?.[0]?.url,
    data?.data?.[0]?.b64_json,
    data?.data?.[0]?.image,
    data?.images?.[0]?.url,
    data?.images?.[0],
    data?.url,
    data?.image,
    data?.result?.url,
    data?.output?.url,
  ];
  return candidates.find((item) => typeof item === "string" && item.trim());
};

const getTaskId = (data: any): string | undefined => {
  const candidates = [data?.task_id, data?.taskId, data?.id, data?.data?.task_id, data?.data?.id];
  return candidates.find((item) => typeof item === "string" && item.trim());
};

const getTaskStatus = (data: any): string => {
  const candidates = [data?.status, data?.task_status, data?.data?.status, data?.data?.task_status, data?.task?.status, data?.result?.status];
  const status = candidates.find((item) => typeof item === "string" && item.trim());
  return (status || "").toUpperCase();
};

const getTaskError = (data: any): string | undefined => {
  const candidates = [data?.error_msg, data?.error, data?.message, data?.msg, data?.data?.error_msg, data?.data?.message];
  return candidates.find((item) => typeof item === "string" && item.trim());
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, _think: boolean, _thinkLevel: 0 | 1 | 2 | 3) => {
  return createOpenAI({ baseURL: getBaseUrl(), apiKey: getApiKey() }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const prompt = (config.prompt || "").trim();
  if (!prompt) {
    throw new Error("图片提示词不能为空");
  }

  const imageRefs = config.referenceList ?? [];
  if (imageRefs.length > 4) {
    throw new Error("七牛多图参考最多支持4张图片");
  }

  const isMultiReference = imageRefs.length >= 2;
  if (isMultiReference && model.modelName !== "kling-v2") {
    throw new Error("七牛多图参考生图当前仅支持 kling-v2 模型");
  }

  const body: Record<string, any> = {
    model: model.modelName,
    prompt,
    n: 1,
    aspect_ratio: parseAspectRatio(config.aspectRatio),
  };

  let createUrl = `${getBaseUrl()}/images/generations`;

  if (isMultiReference) {
    logger(`[qiniu] 开始处理多图参考，模型: ${model.modelName}`);
    const compressedRefs = await Promise.all(imageRefs.map((item) => zipImage(item.base64, 9500)));
    body.image = "";
    body.subject_image_list = compressedRefs.map((base64) => ({
      subject_image: normalizeBase64(base64),
    }));
    createUrl = `${getBaseUrl()}/images/edits`;
  } else if (imageRefs.length === 1) {
    logger(`[qiniu] 开始压缩参考图，模型: ${model.modelName}`);
    const compressed = await zipImage(imageRefs[0].base64, 9500);
    body.image = normalizeBase64(compressed);
  }

  logger(`[qiniu] 提交图片生成任务，模型: ${model.modelName}`);
  const createResponse = await axios.post(createUrl, body, {
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
    },
  });

  const createData = createResponse?.data;
  const directResult = extractImageUrl(createData);
  if (directResult) {
    if (directResult.startsWith("http://") || directResult.startsWith("https://")) {
      return await urlToBase64(directResult);
    }
    if (/^[A-Za-z0-9+/=\s]+$/.test(directResult) && !directResult.startsWith("data:")) {
      return `data:image/png;base64,${directResult.replace(/\s+/g, "")}`;
    }
    return directResult;
  }

  const taskId = getTaskId(createData);
  if (!taskId) {
    throw new Error(`图片任务创建失败: ${JSON.stringify(createData)}`);
  }

  logger(`[qiniu] 图片任务ID: ${taskId}`);
  const pollResult = await pollTask(async () => {
    logger(`[qiniu] 轮询图片任务: ${taskId}`);
    const queryResponse = await axios.get(`${getBaseUrl()}/images/generations/${taskId}`, {
      headers: {
        Authorization: getAuthorization(),
      },
    });

    const queryData = queryResponse?.data;
    const status = getTaskStatus(queryData);
    const imageUrl = extractImageUrl(queryData);

    if (imageUrl) {
      return { completed: true, data: imageUrl };
    }

    if (["FAILED", "FAIL", "ERROR", "CANCELED", "CANCELLED"].includes(status)) {
      return { completed: true, error: getTaskError(queryData) || "图片生成失败" };
    }

    if (["SUCCEEDED", "SUCCESS", "COMPLETED", "DONE"].includes(status)) {
      return { completed: true, error: "图片生成完成但未返回图片结果" };
    }

    return { completed: false };
  }, 3000, 300000);

  if (pollResult.error) {
    throw new Error(pollResult.error);
  }

  if (!pollResult.data) {
    throw new Error("图片生成完成但未获取到结果");
  }

  if (pollResult.data.startsWith("http://") || pollResult.data.startsWith("https://")) {
    return await urlToBase64(pollResult.data);
  }
  if (/^[A-Za-z0-9+/=\s]+$/.test(pollResult.data) && !pollResult.data.startsWith("data:")) {
    return `data:image/png;base64,${pollResult.data.replace(/\s+/g, "")}`;
  }
  return pollResult.data;
};

const videoRequest = async (_config: VideoConfig, _model: VideoModel): Promise<string> => {
  return "";
};

const ttsRequest = async (_config: TTSConfig, _model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: vendor.version, notice: "## 当前已是最新版本" };
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
