/**
 * MiniMax-H3 视频供应商适配
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
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>;
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
  id: "minimax-h3",
  version: "2.0",
  author: "MiniMax",
  name: "MiniMax H3",
  description: "MiniMax-H3 视频生成接口，支持文生视频、首尾帧及图片/视频/音频参考。\n\nAPI 申请渠道：\n\n官网：[https://www.minMaxi.com](https://platform.minimaxi.com/console/access)",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "例如：https://api.minimaxi.com/v2" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://api.minimaxi.com/v2",
  },
  models: [
    {
      name: "MiniMax-H3",
      modelName: "minimax-h3",
      type: "video",
      mode: [
        "text",
        "singleImage",
        "startEndRequired",
        "endFrameOptional",
        "startFrameOptional",
        ["imageReference:5", "videoReference:1", "audioReference:1"],
      ],
      audio: true,
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["768P", "2K"] }],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl.trim().replace(/\/+$/, "");

const getAuthorization = () => {
  const apiKey = vendor.inputValues.apiKey.trim().replace(/^Bearer\s+/i, "");
  if (!apiKey) throw new Error("缺少 API 密钥");
  return `Bearer ${apiKey}`;
};

const getErrorMessage = (data: any, fallback: string) => {
  const error = data?.task?.error ?? data?.error;
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  return fallback;
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (_model: TextModel, _think: boolean, _thinkLevel: 0 | 1 | 2 | 3) => {
  throw new Error("MiniMax H3 供应商仅支持视频生成");
};

const imageRequest = async (_config: ImageConfig, _model: ImageModel): Promise<string> => {
  throw new Error("MiniMax H3 供应商仅支持视频生成");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const references = config.referenceList ?? [];
  const images = references.filter((reference) => reference.type === "image");
  const videos = references.filter((reference) => reference.type === "video");
  const audios = references.filter((reference) => reference.type === "audio");
  const usesStartEndFrames = config.mode.includes("startEndRequired") || config.mode.includes("endFrameOptional") || config.mode.includes("startFrameOptional");

  if (!config.prompt.trim()) throw new Error("视频提示词不能为空");
  if (usesStartEndFrames && images.length > 2) throw new Error("首尾帧模式最多支持 2 张图片");
  if (config.mode.includes("startEndRequired") && images.length !== 2) throw new Error("首尾帧模式需要 2 张参考图");
  if (config.mode.includes("singleImage") && !usesStartEndFrames && images.length !== 1) throw new Error("单图模式需要 1 张参考图");
  if (videos.length > 1) throw new Error("最多支持 1 个视频参考");
  if (audios.length > 1) throw new Error("最多支持 1 个音频参考");
  if (images.length > 5 && !usesStartEndFrames) throw new Error("最多支持 5 张图片参考");
  if (audios.length > 0 && images.length + videos.length === 0) throw new Error("音频参考必须同时提供图片或视频参考");

  const content: any[] = [{ type: "text", text: config.prompt }];
  if (usesStartEndFrames) {
    if (images[0]) content.push({ type: "image_url", image_url: { url: images[0].base64 }, role: "first_frame" });
    if (images[1]) content.push({ type: "image_url", image_url: { url: images[1].base64 }, role: "last_frame" });
  } else {
    images.forEach((reference) => content.push({ type: "image_url", image_url: { url: reference.base64 }, role: "reference_image" }));
  }
  videos.forEach((reference) => content.push({ type: "video_url", video_url: { url: reference.base64 }, role: "reference_video" }));
  audios.forEach((reference) => content.push({ type: "audio_url", audio_url: { url: reference.base64 }, role: "reference_audio" }));

  const headers = { Authorization: getAuthorization(), "Content-Type": "application/json" };
  const baseUrl = getBaseUrl();
  logger(`[minimax] 提交视频生成任务，模型: ${model.modelName}`);

  let taskId: string;
  try {
    const createResponse = await axios.post(`${baseUrl}/video_generation`, {
      model: model.modelName,
      resolution: config.resolution,
      duration: config.duration,
      ratio: config.aspectRatio,
      content,
    }, { headers });
    taskId = createResponse.data?.task_id ?? createResponse.data?.task?.id ?? createResponse.data?.id;
    if (!taskId) throw new Error(getErrorMessage(createResponse.data, "未返回任务 ID"));
  } catch (error: any) {
    throw new Error(`视频任务创建失败: ${getErrorMessage(error?.response?.data, error?.message || "未知错误")}`);
  }

  logger(`[minimax] 视频任务 ID: ${taskId}`);
  const result = await pollTask(async () => {
    try {
      const queryResponse = await axios.get(`${baseUrl}/query/video_generation/${encodeURIComponent(taskId)}`, { headers });
      const task = queryResponse.data?.task ?? queryResponse.data;
      const status = String(task?.status || "").toLowerCase();
      logger(`[minimax] 视频任务状态: ${status || "unknown"}`);

      if (status === "succeeded") {
        return task?.content?.url
          ? { completed: true, data: task.content.url }
          : { completed: true, error: "视频任务完成但未返回视频地址" };
      }
      if (["failed", "cancelled", "expired"].includes(status)) {
        return { completed: true, error: getErrorMessage(queryResponse.data, "视频生成失败") };
      }
      return { completed: false };
    } catch (error: any) {
      return { completed: true, error: getErrorMessage(error?.response?.data, error?.message || "视频任务查询失败") };
    }
  }, 5000, 60 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) throw new Error("视频任务完成但未返回视频地址");
  return await urlToBase64(result.data);
};

const ttsRequest = async (_config: TTSConfig, _model: TTSModel): Promise<string> => {
  throw new Error("MiniMax H3 供应商仅支持视频生成");
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
