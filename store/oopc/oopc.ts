/**
 * OOPC AI 供应商适配器
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
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAI: any;
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
};

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "oopc",
  version: "2.0",
  author: "oopc",
  name: "OOPC",
  description: "gpt-image-2 ¥0.04/张！\n\nMiniMax-H3 ¥0.2/秒！\n\ns-video1元/条起。\n\n支持 OpenAI 兼容、Gemini 原生、Claude 原生文本对话，以及 Qwen Image 和 Nano Banana 图像生成。\n\n正在内测中，加微信 jxppro 获取 内测账号！",
  inputs: [
    { key: "apiKey", label: "默认API密钥", type: "password", required: true, placeholder: "未填写专用密钥时使用，推荐使用 auto 自动分组" },
    { key: "textKey", label: "文本API密钥", type: "password", required: false, placeholder: "不填则使用默认API密钥" },
    { key: "imageKey", label: "图像API密钥", type: "password", required: false, placeholder: "不填则使用默认API密钥" },
    { key: "videoKey", label: "视频API密钥", type: "password", required: false, placeholder: "不填则使用默认API密钥" },
    { key: "baseUrl", label: "基础URL", type: "url", required: false, placeholder: "例如：https://api.oopc.top/v1" },
  ],
  inputValues: { apiKey: "", textKey: "", imageKey: "", videoKey: "", baseUrl: "https://api.oopc.top/v1" },
  models: [
    { name: "MiniMax-H3", modelName: "MiniMax-H3", type: "video", mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", "startFrameOptional", ["imageReference:5", "videoReference:1", "audioReference:1"]], audio: true, durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["2K", "768P"] }] },
    { name: "GPT Image 2", modelName: "gpt-image-2", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "Gemini 3 pro image", modelName: "gemini-3-pro-image", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "Gemini 3.1 Flash Image", modelName: "gemini-3.1-flash-image", type: "image", mode: ["text", "singleImage", "multiReference"] },
    { name: "GPT-5.5", modelName: "gpt-5.5", type: "text", think: true },
    { name: "GPT 5.6 Terra", modelName: "gpt-5.6-terra", type: "text", think: true },
    { name: "GPT 5.6 Sol", modelName: "gpt-5.6-sol", type: "text", think: true },
    { name: "Claude Opus 4.8", modelName: "claude-opus-4-8", type: "text", think: true },
    { name: "Claude Opus 5.0", modelName: "claude-opus-5-0", type: "text", think: true },
    { name: "Claude Sonnet 5", modelName: "claude-sonnet-5", type: "text", think: true },
    { name: "Gemini 3.1 Pro", modelName: "gemini-3.1-pro-preview", type: "text", think: true },
    { name: "Gemini 3.5 Flash", modelName: "gemini-3.5-flash", type: "text", think: true },
    { name: "S-Video", modelName: "s-video-v1", type: "video", mode: ["text", "endFrameOptional", ["imageReference:8"]], audio: true, durationResolutionMap: [{ duration: [5, 10, 15], resolution: ["720p"] }] },
    { name: "Firefly Video v2 Fast", modelName: "firefly-video-v2-fast", type: "video", mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", "startFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]], audio: true, durationResolutionMap: [{ duration: [5, 10, 15], resolution: ["480p", "720p"] }] },
    { name: "Firefly Video v2", modelName: "firefly-video-v2", type: "video", mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", "startFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]], audio: true, durationResolutionMap: [{ duration: [5, 10, 15], resolution: ["480p", "720p", "1080p"] }] },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");

const getApiOrigin = () => getBaseUrl().replace(/\/v1$/, "");

const getApiKey = (type?: "text" | "image" | "video") => {
  const specificKey = type === "text" ? vendor.inputValues.textKey : type === "image" ? vendor.inputValues.imageKey : type === "video" ? vendor.inputValues.videoKey : "";
  const apiKey = (specificKey || vendor.inputValues.apiKey).replace(/^Bearer\s+/i, "");
  if (!apiKey) throw new Error(`缺少${type === "text" ? "文本" : type === "image" ? "图像" : type === "video" ? "视频" : "默认"} API Key`);
  return apiKey;
};

const getErrorMessage = (error: any) => error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "请求失败";

const getImageData = (base64: string) => {
  const match = base64.match(/^data:([^;,]+);base64,(.+)$/);
  return { mimeType: match?.[1] || "image/png", data: match?.[2] || base64 };
};

const getImageResult = async (data: any): Promise<string> => {
  const image = data?.data?.[0];
  if (image?.b64_json) return image.b64_json.startsWith("data:") ? image.b64_json : `data:image/png;base64,${image.b64_json}`;
  if (image?.url) return urlToBase64(image.url);
  const part = data?.candidates?.[0]?.content?.parts?.find((item: any) => item.inlineData || item.inline_data);
  const inlineData = part?.inlineData || part?.inline_data;
  if (inlineData?.data) return `data:${inlineData.mimeType || inlineData.mime_type || "image/png"};base64,${inlineData.data}`;
  throw new Error("接口未返回图片数据");
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  const apiKey = getApiKey("text");
  const baseURL = getBaseUrl();
  if (!baseURL) throw new Error("缺少基础 URL");
  const enableThinking = model.think && think && thinkLevel > 0;
  const effortMap: Record<0 | 1 | 2 | 3, "low" | "medium" | "high" | "xhigh"> = { 0: "low", 1: "low", 2: "medium", 3: "high" };

  if (model.modelName.startsWith("gemini-")) {
    return createGoogleGenerativeAI({
      baseURL: `${getApiOrigin()}/v1beta/models/${model.modelName}:generateContent`,
      apiKey,
      generationConfig: { thinkingConfig: { includeThoughts: enableThinking, thinkingLevel: effortMap[thinkLevel] } },
    }).chat(model.modelName);
  }
  if (model.modelName.startsWith("claude-")) {
    return createAnthropic({
      baseURL,
      apiKey,
      extraBody: enableThinking ? { thinking: { type: "adaptive" }, effort: effortMap[thinkLevel] } : {},
    }).chat(model.modelName);
  }
  if (model.modelName.startsWith("deepseek-")) {
    return createDeepSeek({
      baseURL,
      apiKey,
      extraBody: { thinking: { type: enableThinking ? "enabled" : "disabled" }, reasoning_effort: effortMap[thinkLevel] },
    }).chat(model.modelName);
  }
  if (model.modelName.startsWith("minimax-")) return createMinimax({ baseURL: `${getApiOrigin()}/v1/messages`, apiKey }).chat(model.modelName);
  return createOpenAI({
    baseURL,
    apiKey,
    extraBody: { reasoning_effort: enableThinking ? effortMap[thinkLevel] : undefined },
  }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const apiKey = getApiKey("image");
  const baseUrl = getBaseUrl();
  if (!baseUrl) throw new Error("缺少基础 URL");
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const references = config.referenceList || [];
  try {
    if (model.modelName.startsWith("gemini-")) {
      logger("提交 Gemini 图片生成任务");
      const parts: any[] = [{ text: config.prompt }];
      references.forEach((reference) => {
        const image = getImageData(reference.base64);
        parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
      });
      const response = await axios.post(`${getApiOrigin()}/v1beta/models/${model.modelName}:generateContent/`, {
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: config.aspectRatio, imageSize: config.size } },
      }, { headers });
      return getImageResult(response.data);
    }

    const imageSizeMap: Record<ImageConfig["size"], Record<string, string>> = {
      "1K": { "1:1": "1024x1024", "16:9": "1536x1024", "9:16": "1024x1536" },
      "2K": { "1:1": "2048x2048", "16:9": "2048x1152" },
      "4K": { "16:9": "3840x2160", "9:16": "2160x3840" },
    };
    const imageSize = imageSizeMap[config.size][config.aspectRatio] || "16:9";
    const isQwenImage = model.modelName.startsWith("qwen-image-");
    const isEdit = references.length > 0 || model.modelName.includes("edit");

    if (isQwenImage) {
      const content: any[] = references.map((reference) => ({ image: reference.base64 }));
      content.push({ text: config.prompt });
      logger(`提交 Qwen 图片${isEdit ? "编辑" : "生成"}任务`);
      const response = await axios.post(`${baseUrl}/images/${isEdit ? "edits" : "generations"}`, {
        model: model.modelName,
        input: { messages: [{ role: "user", content }] },
        parameters: { size: config.aspectRatio.replace(":", "*"), prompt_extend: true, watermark: false },
      }, { headers });
      return getImageResult(response.data);
    }

    if (isEdit) {
      logger("提交 OpenAI 图片编辑任务");
      const formData = new FormData();
      formData.append("model", model.modelName);
      formData.append("prompt", config.prompt);
      formData.append("size", imageSize);
      formData.append("n", "1");
      references.forEach((reference, index) => {
        const image = getImageData(reference.base64);
        formData.append("image", Buffer.from(image.data, "base64"), `image-${index + 1}.${image.mimeType.split("/")[1] || "png"}`);
      });
      const response = await axios.post(`${baseUrl}/images/edits`, formData, {
        headers: { Authorization: `Bearer ${apiKey}`, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
      });
      return getImageResult(response.data);
    }

    logger("提交 OpenAI 图片生成任务");
    const response = await axios.post(`${baseUrl}/images/generations`, {
      model: model.modelName,
      prompt: config.prompt,
      size: imageSize,
      n: 1,
      quality: config.size === "1K" ? "low" : config.size === "2K" ? "medium" : "high",
    }, { headers });
    return getImageResult(response.data);
  } catch (error) {
    throw new Error(`图片请求失败：${getErrorMessage(error)}`);
  }
};

const requestVideoGenerations = async (
  baseUrl: string,
  headers: Record<string, string>,
  modelName: string,
  prompt: string,
  duration: number,
  aspectRatio: VideoConfig["aspectRatio"],
  imageReferences: string[],
  mode: VideoMode[],
): Promise<string> => {
  try {
    logger(`提交视频生成任务，模型: ${modelName}`);
    const isEndFrameOptional = mode.includes("endFrameOptional");
    const referencePayload = isEndFrameOptional
      ? imageReferences.length > 0 ? { image: imageReferences[0] } : {}
      : imageReferences.length === 1
        ? { image: imageReferences[0] }
        : imageReferences.length > 1
          ? { images: imageReferences }
          : {};
    const createResponse = await axios.post(`${baseUrl}/video/generations`, {
      model: modelName,
      prompt,
      duration,
      ratio: aspectRatio,
      ...referencePayload,
    }, { headers });

    const createData = createResponse.data;
    const taskId = createData?.task_id || createData?.data?.task_id || createData?.id;
    if (!taskId) throw new Error(`视频任务创建失败: ${JSON.stringify(createData)}`);

    const result = await pollTask(async () => {
      const queryResponse = await axios.get(`${baseUrl}/video/generations/${encodeURIComponent(taskId)}`, { headers });
      const queryData = queryResponse.data;
      const status = String(queryData?.data?.status || queryData?.status || "").toLowerCase();
      logger(`视频任务状态: ${status || "unknown"}`);

      if (["success", "completed", "succeeded"].includes(status)) {
        const videoUrl = queryData?.data?.data?.download_url || queryData?.data?.download_url || queryData?.data?.result_url || queryData?.result_url;
        return videoUrl ? { completed: true, data: videoUrl } : { completed: true, error: "视频任务完成，但未返回可用下载地址" };
      }
      if (["failed", "failure", "error"].includes(status)) {
        return { completed: true, error: queryData?.data?.fail_reason || queryData?.message || "视频生成失败" };
      }
      return { completed: false };
    }, 5000, 10 * 60 * 1000);

    if (result.error) throw new Error(result.error);
    if (!result.data) throw new Error("视频任务完成，但未返回可用下载地址");
    return result.data;
  } catch (error) {
    throw new Error(`视频请求失败：${getErrorMessage(error)}`);
  }
};

const requestMinimaxH3VideoGeneration = async (
  apiKey: string,
  config: VideoConfig,
  model: VideoModel,
): Promise<string> => {
  try {
    const references = config.referenceList ?? [];
    const images = references.filter((reference) => reference.type === "image");
    const videos = references.filter((reference) => reference.type === "video");
    const audios = references.filter((reference) => reference.type === "audio");
    const isStartEndMode = config.mode.includes("startEndRequired") || config.mode.includes("endFrameOptional") || config.mode.includes("startFrameOptional");
    if (isStartEndMode && images.length > 2) throw new Error("首尾帧模式最多支持 2 张图片");
    if (config.mode.includes("startEndRequired") && images.length !== 2) throw new Error("首尾帧模式需要 2 张参考图");
    if (config.mode.includes("singleImage") && !isStartEndMode && images.length !== 1) throw new Error("单图模式需要 1 张参考图");
    if (audios.length > 0 && images.length + videos.length === 0) throw new Error("音频参考必须同时提供图片或视频参考");

    const content: any[] = [{ type: "text", text: config.prompt }];
    if (isStartEndMode) {
      if (images[0]) content.push({ type: "image_url", image_url: { url: images[0].base64 }, role: "first_frame" });
      if (images[1]) content.push({ type: "image_url", image_url: { url: images[1].base64 }, role: "last_frame" });
    } else {
      images.forEach((reference) => content.push({ type: "image_url", image_url: { url: reference.base64 }, role: "reference_image" }));
    }
    videos.forEach((reference) => content.push({ type: "video_url", video_url: { url: reference.base64 }, role: "reference_video" }));
    audios.forEach((reference) => content.push({ type: "audio_url", audio_url: { url: reference.base64 }, role: "reference_audio" }));

    const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
    const baseUrl = `${getApiOrigin()}/v1`;//为了兼容修改的，后期可能会按照官方格式调整
    logger("提交 MiniMax-H3 视频生成任务" + `${baseUrl}/videos`);
    logger(JSON.stringify({
      model: model.modelName,
      resolution: config.resolution,
      duration: config.duration,
      ratio: config.aspectRatio,
      prompt: config.prompt,//为了兼容增加的，特殊匹配字段，后期可能删除
    }));

    const createResponse = await axios.post(`${baseUrl}/videos`, {
      model: model.modelName,
      resolution: config.resolution,
      duration: config.duration,
      ratio: config.aspectRatio,
      prompt: config.prompt,//为了兼容增加的，特殊匹配字段，后期可能删除
      content,
    }, { headers });
    logger(createResponse.data);
    const taskId = createResponse.data?.task_id || createResponse.data?.task?.id || createResponse.data?.id;
    if (!taskId) throw new Error(`视频任务创建失败: ${JSON.stringify(createResponse.data)}`);

    const result = await pollTask(async () => {
      const queryData = (await axios.get(`${baseUrl}/videos/${encodeURIComponent(taskId)}`, { headers })).data;
      logger("查询 MiniMax-H3 视频任务状态" + `${baseUrl}/videos/${taskId}`);
      const task = queryData?.task || queryData;
      const status = String(task?.status || "").toLowerCase();
      logger(`MiniMax-H3 视频任务状态: ${status || "unknown"}`);
      // logger("查询 MiniMax-H3 视频查询结果" + JSON.stringify(task));
      if (["success", "completed", "succeeded"].includes(status)) return { completed: true, data: task?.download_url || task?.content?.url };
      if (["failed", "cancelled", "expired"].includes(status)) return { completed: true, error: task?.error?.message || "视频生成失败" };
      return { completed: false };
    }, 5000, 60 * 60 * 1000);

    if (result.error) throw new Error(result.error);
    if (!result.data) throw new Error("视频任务完成，但未返回可用下载地址");
    return result.data;
  } catch (error) {
    throw new Error(`MiniMax-H3 视频请求失败：${getErrorMessage(error)}`);
  }
};

const requestMultipartVideoGeneration = async (
  baseUrl: string,
  apiKey: string,
  config: VideoConfig,
  modelName: string,
): Promise<string> => {
  try {
    const references = config.referenceList ?? [];
    const images = references.filter((reference) => reference.type === "image");
    const videos = references.filter((reference) => reference.type === "video");
    const audios = references.filter((reference) => reference.type === "audio");
    const isStartEndMode = config.mode.includes("startEndRequired") || config.mode.includes("endFrameOptional") || config.mode.includes("startFrameOptional");
    if (isStartEndMode && images.length > 2) throw new Error("首尾帧模式最多支持 2 张图片");
    if (config.mode.includes("startEndRequired") && images.length !== 2) throw new Error("首尾帧模式需要 2 张参考图");
    if (config.mode.includes("singleImage") && !isStartEndMode && images.length !== 1) throw new Error("单图模式需要 1 张参考图");
    if (audios.length > 0 && images.length + videos.length === 0) throw new Error("音频参考必须同时提供图片或视频参考");

    const appendMedia = (formData: any, field: string, reference: ReferenceList, index: number) => {
      const match = reference.base64.match(/^data:([^;,]+);base64,(.+)$/);
      const mimeType = match?.[1] || (reference.type === "image" ? "image/png" : reference.type === "video" ? "video/mp4" : "audio/mpeg");
      const extension = mimeType.split("/")[1]?.split(";")[0] || "bin";
      formData.append(field, Buffer.from(match?.[2] || reference.base64, "base64"), `${reference.type}-${index + 1}.${extension}`);
    };

    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("prompt", config.prompt);
    formData.append("duration", String(config.duration));
    formData.append("resolution", config.resolution);
    formData.append("aspect_ratio", config.aspectRatio);
    formData.append("generate_audio", config.audio ? "true" : "false");
    if (isStartEndMode) {
      if (images[0]) appendMedia(formData, "first_frame", images[0], 0);
      if (images[1]) appendMedia(formData, "last_frame", images[1], 1);
    } else {
      images.forEach((reference, index) => appendMedia(formData, "images", reference, index));
    }
    videos.forEach((reference, index) => appendMedia(formData, "videos", reference, index));
    audios.forEach((reference, index) => appendMedia(formData, "audios", reference, index));

    logger(`提交 multipart 视频生成任务，模型: ${modelName}`);
    const headers = { Authorization: `Bearer ${apiKey}` };
    const createResponse = await axios.post(`${baseUrl}/videos`, formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    const taskId = createResponse.data?.id || createResponse.data?.task_id;
    if (!taskId) throw new Error(`视频任务创建失败: ${JSON.stringify(createResponse.data)}`);

    const result = await pollTask(async () => {
      const queryData = (await axios.get(`${baseUrl}/videos/${encodeURIComponent(taskId)}`, { headers })).data;
      const status = String(queryData?.status || "").toLowerCase();
      logger(`视频任务状态: ${status || "unknown"}`);
      if (status === "completed") return { completed: true, data: `/v1/videos/${taskId}/content` };
      if (status === "failed") return { completed: true, error: queryData?.error?.message || queryData?.message || "视频生成失败" };
      return { completed: false };
    }, 5000, 60 * 60 * 1000);

    if (result.error) throw new Error(result.error);
    if (!result.data) throw new Error("视频任务完成，但未返回可用下载地址");
    const downloadUrl = result.data.startsWith("http") ? result.data : `${getApiOrigin()}${result.data.startsWith("/") ? result.data : `/${result.data}`}`;
    logger(`视频下载地址: ${downloadUrl || "unknown"}`);
    const videoResponse = await axios.get(downloadUrl, { headers, responseType: "arraybuffer" });
    const mimeType = videoResponse.headers?.["content-type"]?.split(";")[0] || "video/mp4";
    return `data:${mimeType};base64,${Buffer.from(videoResponse.data).toString("base64")}`;
  } catch (error) {
    throw new Error(`multipart 视频请求失败：${getErrorMessage(error)}`);
  }
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const apiKey = getApiKey("video");
  const baseUrl = getBaseUrl();
  if (!baseUrl) throw new Error("缺少基础 URL");

  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const references = config.referenceList ?? [];

  if (model.modelName === "MiniMax-H3" || model.modelName === "minimax-h3") {
    return requestMinimaxH3VideoGeneration(apiKey, config, model);
  }
  if (model.modelName.startsWith("firefly-video-v2")) {
    return requestMultipartVideoGeneration(baseUrl, apiKey, config, model.modelName);
  }
  if (!config.duration) {
    config.duration = 5;
  }
  const requestModelName = model.modelName === "s-video-v1"
    ? `${model.modelName}-${config.duration}s`
    : model.modelName;
  const imageReferences = references
    .filter((reference) => reference.type === "image")
    .map((reference) => getImageData(reference.base64))
    .map((image) => `data:${image.mimeType};base64,${image.data}`);
  if (config.mode.includes("endFrameOptional") && imageReferences.length > 1) {
    throw new Error("endFrameOptional 模式仅支持 1 张参考图");
  }

  return requestVideoGenerations(
    baseUrl,
    headers,
    requestModelName,
    config.prompt,
    config.duration,
    config.aspectRatio,
    imageReferences,
    config.mode,
  );
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
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

export { };
