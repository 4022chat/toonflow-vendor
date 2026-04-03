// ==================== 类型定义 ====================
// 文本模型
interface TextModel {
  name: string; // 显示名称
  modelName: string;
  type: "text";
  multimodal: boolean; // 前端显示用
  tool: boolean; // 前端显示用
  think: boolean; // 前端显示用
}

// 图像模型
interface ImageModel {
  name: string; // 显示名称
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
}
// 视频模型
interface VideoModel {
  name: string; // 显示名称
  modelName: string; //全局唯一
  type: "video";
  mode: (
    | "singleImage" // 单图
    | "multiImage" // 多图模式
    | "gridImage" // 网格单图（传入一张图片，但该图片是网格图）
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[] // 混合参考
  )[];
  associationSkills?: string; // 关联技能，多个技能用逗号分隔
  audio: "optional" | false | true; // 音频配置
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string; // 显示名称
  modelName: string;
  type: "tts";
  voices: {
    title: string; //显示名称
    voice: string; //说话人
  }[];
}
// 供应商配置
interface VendorConfig {
  id: string; //供应商唯一标识，必须全局唯一
  author: string;
  description?: string; //md5格式
  name: string;
  icon?: string; //仅支持base64格式
  inputs: {
    key: string;
    label: string;
    type: "text" | "password" | "url";
    required: boolean;
    placeholder?: string;
  }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel)[];
}

// ==================== 供应商数据 ====================
const vendor: VendorConfig = {
  id: "openai.4022543.xyz",
  author: "四零二二",
  description: "支持所有兼容 OpenAI 官方接口规范的API，支持文本、图像、视频和语音能力。\n\n欢迎使用我的其他插件：https://tf.4022543.xyz",
  name: "OpenAI 官方接口",
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
    {
      name: "GPT-5.4",
      type: "text",
      modelName: "gpt-5.4",
      multimodal: true,
      tool: true,
      think:true
    },
    {
      name: "GPT-5.4 Mini",
      type: "text",
      modelName: "gpt-5.4-mini",
      multimodal: true,
      tool: true,
      think:true
    },
    {
      name: "GPT-5.4 Nano",
      type: "text",
      modelName: "gpt-5.4-nano",
      multimodal: true,
      tool: true,
      think:true
    },
    {
      name: "GPT Image 1.5",
      type: "image",
      modelName: "gpt-image-1.5",
      mode: ["text", "singleImage", "multiReference"],
    },
    {
      name: "GPT Image 1",
      type: "image",
      modelName: "gpt-image-1",
      mode: ["text", "singleImage", "multiReference"],
    },
    {
      name: "GPT Image 1-mini",
      type: "image",
      modelName: "gpt-image-1-mini",
      mode: ["text", "singleImage", "multiReference"],
    },
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
    }
  ],
};
exports.vendor = vendor;

// ==================== 全局工具函数 ====================
declare const axios: any;
declare const zipImageResolution: (completeBase64: string, width: number, height: number) => Promise<string>;
declare const pollTask: (
  fn: () => Promise<{ completed: boolean; data?: string; error?: string }>,
  interval?: number,
  timeout?: number,
) => Promise<{ completed: boolean; data?: string; error?: string }>;
declare const createOpenAI: any;
declare const exports: any;

// ==================== 工具函数 ====================
const DEFAULT_BASE_URL = "https://api.openai.com/v1";
// const DEFAULT_TEXT_BASE_URL = "https://api.openai.com/v1";
// const DEFAULT_IMAGE_URL = "https://api.openai.com/v1/images/generations";
// const DEFAULT_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits";
// const DEFAULT_VIDEO_CREATE_URL = "https://api.openai.com/v1/videos";
// const DEFAULT_VIDEO_QUERY_URL = "https://api.openai.com/v1/videos/{id}";
// const DEFAULT_VIDEO_DOWNLOAD_URL = "https://api.openai.com/v1/videos/{id}/content";
// const DEFAULT_TTS_URL = "https://api.openai.com/v1/audio/speech";
const buildApiUrl = (baseUrl: string | undefined, path: string) => {
  const url = stripTrailingSlash(baseUrl) || `${DEFAULT_BASE_URL}${path}`;
  return `${url}`;
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

// ==================== 适配器函数 ====================

// 文本请求函数
const textRequest: (textModel: TextModel) => { url: string; model: string } = (textModel) => {
  const apiKey = getApiKey();
  return createOpenAI({
    baseURL: buildApiUrl(vendor.inputValues.textBaseUrl, ""),//系统会自动加上/chat/completions
    apiKey,
  }).chat(textModel.modelName);
};
exports.textRequest = textRequest;

//图片请求函数
interface ImageConfig {
  prompt: string; //图片提示词
  imageBase64: string[]; //输入的图片提示词
  size: "1K" | "2K" | "4K"; // 图片尺寸
  aspectRatio: `${number}:${number}`; // 长宽比
}
const imageRequest = async (imageConfig: ImageConfig, imageModel: ImageModel) => {
  const apiKey = getApiKey();
  const headers = { Authorization: `Bearer ${apiKey}` };

  if (imageConfig.imageBase64 && imageConfig.imageBase64.length) {
    const body = new FormData();
    body.append("model", imageModel.modelName);
    body.append("prompt", imageConfig.prompt);
    body.append("size", getImageSize(imageConfig.aspectRatio));

    imageConfig.imageBase64.forEach((item, index) => {
      const { mime, base64 } = parseBase64(item);
      body.append("image", Buffer.from(base64, "base64"), {
        filename: `image-${index}.${getImageExtension(mime)}`,
        contentType: mime,
      });
    });

    const response = await axios.post(buildApiUrl(vendor.inputValues.imageEdit, "/images/edits"), body, {
      headers: { ...headers, ...body.getHeaders() },
    });
    const data = response.data;
    return data?.data?.[0]?.b64_json || data?.data?.[0]?.url;
  }

  const response = await fetch(buildApiUrl(vendor.inputValues.image, "/images/generations"), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: imageModel.modelName,
      prompt: imageConfig.prompt,
      size: getImageSize(imageConfig.aspectRatio),
    }),
  });
  await ensureSuccess(response);
  const data = await response.json();
  return data?.data?.[0]?.b64_json || data?.data?.[0]?.url;
};
exports.imageRequest = imageRequest;

interface VideoConfig {
  duration: number; //视频时长，单位秒
  resolution: string; //视频分辨率，如"720p"、"1080p"
  aspectRatio: "16:9" | "9:16"; //视频长宽比
  prompt: string; //视频提示词
  fileBase64?: string[]; // 文件base64 包含图片base64、视频base64、音频base64
  audio?: boolean;
  mode:
    | "singleImage" // 单图
    | "multiImage" // 多图模式
    | "gridImage" // 网格单图（传入一张图片，但该图片是网格图）
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[]; // 混合参考
}

const videoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  const apiKey = getApiKey();
  const createUrl = buildApiUrl(vendor.inputValues.VideoCreate, "/videos/create");
  const queryUrl = buildApiUrl(vendor.inputValues.VideoQuery, "/videos/{id}");
  const downloadUrl = buildApiUrl(vendor.inputValues.VideoDownload, "/videos/{id}/content");
  const size = getVideoSize(videoConfig.resolution, videoConfig.aspectRatio);

  const body = new FormData();
  body.append("model", videoModel.modelName);
  body.append("prompt", videoConfig.prompt);
  body.append("seconds", String(videoConfig.duration));
  body.append("size", size);

  const imageBase64 = videoConfig.fileBase64?.[0];
  if (imageBase64) {
    const [width, height] = size.split("x").map(Number);
    const resizedBase64 = await zipImageResolution(imageBase64, width, height);
    const { mime, base64 } = parseBase64(resizedBase64);
    body.append("input_reference", Buffer.from(base64, "base64"), {
      filename: `reference.${getImageExtension(mime)}`,
      contentType: mime,
    });
  }

  const response = await axios.post(createUrl, body, {
    headers: { Authorization: `Bearer ${apiKey}`, ...body.getHeaders() },
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
      return { completed: false, error: queryData?.error?.message || "视频生成失败" };
    }
    return { completed: false };
  });

  if (result.error) throw new Error(result.error);
  return result.data;
};
exports.videoRequest = videoRequest;

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
}
const ttsRequest = async (ttsConfig: TTSConfig, ttsModel: TTSModel) => {
  const apiKey = getApiKey();
  const response = await fetch(buildApiUrl(vendor.inputValues.tts, "/audio/speech"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ttsModel.modelName,
      input: ttsConfig.text,
      voice: ttsConfig.voice,
      response_format: "mp3",
      instructions: buildSpeechInstructions(ttsConfig),
    }),
  });
  await ensureSuccess(response);
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
};
exports.ttsRequest = ttsRequest;
