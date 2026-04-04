// ==================== 类型定义 ====================
interface TextModel {
  name: string;
  modelName: string;
  type: "text";
  multimodal: boolean;
  tool: boolean;
  think: boolean; // 前端显示用
}

interface ImageModel {
  name: string;
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
}

interface VideoModel {
  name: string;
  modelName: string;
  type: "video";
  mode: (
    | "singleImage" // 单图
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[] // 混合参考
  )[];
  audio: "optional" | false | true;
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string;
  modelName: string;
  type: "tts";
  voices: {
    title: string;
    voice: string;
  }[];
}

interface VendorConfig {
  id: string;
  version: number;
  icon?: string;
  author: string;
  description?: string;
  name: string;
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
  id: "best",
  version: 1,
  author: "四零二二",
  description: "最强组合模型组合，Gemini/ChatGPT/Claude + nano banana + seedance + index-tts\n\n四零二二API中转站，支持所有的模型接入，一个 key 搞定所有。\n\n源头供货，稳定价低，支持[免费试用](https://api.4022543.xyz/register?aff=3Y0U)\n\n新站上线，限时优惠，充0.55=1刀乐，邀请好友可返[点击注册](https://api.4022543.xyz/register?aff=3Y0U)",
  name: "最强组合-四零二二API",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true, placeholder: "到上面的网站注册并复制 key 填入" }
  ],
  inputValues: {
    apiKey: ""
  },
  models: [
    {
      name: "gemini-3.1-pro-preview",
      type: "text",
      modelName: "gemini-3.1-pro-preview",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "豆包 Seedream 5.0",
      type: "image",
      modelName: "doubao-seedream-5-0-260128",
      mode: ["text", "singleImage", "multiReference"],
    },
    {
      name: "豆包 Seedream 4.5",
      type: "image",
      modelName: "doubao-seedream-4-5-251128",
      mode: ["text", "singleImage", "multiReference"],
    },
    {
      name: "gemini-3.1-flash-image-preview",
      type: "image",
      modelName: "gemini-3.1-flash-image-preview",
      mode: ["text","singleImage","multiReference"],
    },
    {
      name: "gemini-3-pro-image-preview",
      type: "image",
      modelName: "gemini-3-pro-image-preview",
      mode: ["text","singleImage","multiReference"],
    },
    {
      name: "doubao-seedance-1-5-pro",
      type: "video",
      modelName: "doubao-seedance-1-5-pro-251215",
      mode: ["text","startEndRequired","endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "viduq3-turbo",
      type: "video",
      modelName: "viduq3-turbo",
      mode: ["text","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], resolution: ["540P","720P","1080P"] }],
    },
    {
      name: "viduq3-pro",
      type: "video",
      modelName: "viduq3-pro",
      mode: ["text","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], resolution: ["540P","720P","1080P"] }],
    },
    {
      name: "gemini-3.1-flash-lite",
      type: "text",
      modelName: "gemini-3.1-flash-lite-preview",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "gemini-3.1-flash-preview",
      type: "text",
      modelName: "gemini-3-flash-preview",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "doubao-seed-2-0-code",
      type: "text",
      modelName: "doubao-seed-2-0-code-preview-260215",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "doubao-seed-2-0-lite",
      type: "text",
      modelName: "doubao-seed-2-0-lite-260215",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "GPT-5.4-mini",
      type: "text",
      modelName: "gpt-5.4-mini",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "gpt-5.4",
      type: "text",
      modelName: "gpt-5.4",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "gpt-5.4-pro",
      type: "text",
      modelName: "gpt-5.4-pro",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "Claude Sonnet 4.6",
      type: "text",
      modelName: "claude-sonnet-4-6",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "claude-opus-4-6",
      type: "text",
      modelName: "claude-opus-4-6",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "claude-opus-4-5-20251101",
      type: "text",
      modelName: "claude-opus-4-5-20251101",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "claude-haiku-4-5-20251001",
      type: "text",
      modelName: "claude-haiku-4-5-20251001",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "kimi-2.5",
      type: "text",
      modelName: "kimi-2.5",
      multimodal: true,
      tool: true,
      think:true,
    },
    {
      name: "MiniMax-M2.7",
      type: "text",
      modelName: "minimax-m2.7",
      multimodal: false,
      tool: true,
      think:true,
    },
    {
      name: "GLM-5",
      type: "text",
      modelName: "glm-5",
      multimodal: false,
      tool: true,
      think:true,
    },
    {
      name: "GPT Image 1.5",
      type: "image",
      modelName: "gpt-image-1.5",
      mode: ["text","singleImage","multiReference"],
    },
    {
      name: "GPT Image 1",
      type: "image",
      modelName: "gpt-image-1",
      mode: ["text","singleImage","multiReference"],
    },
    {
      name: "veo3.1-4k",
      type: "video",
      modelName: "veo3.1-4k",
      mode: ["text","singleImage","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "veo3.1-pro-4k",
      type: "video",
      modelName: "veo3.1-pro-4k",
      mode: ["text","singleImage","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "veo3.1-pro",
      type: "video",
      modelName: "veo3.1-pro",
      mode: ["text","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "veo3.1-components",
      type: "video",
      modelName: "veo3.1-components",
      mode: ["endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "veo3.1-components-4k",
      type: "video",
      modelName: "veo3.1-components-4k",
      mode: ["endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10,15], resolution: ["720P"] }],
    },
    {
      name: "viduq2-pro",
      type: "video",
      modelName: "viduq2-pro",
      mode: ["text","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [1,2,3,4,5,6,7,8,9,10], resolution: ["540P","720P","1080P"] }],
    },
    {
      name: "viduq2",
      type: "video",
      modelName: "viduq2",
      mode: ["text","singleImage"],
      audio: true,
      durationResolutionMap: [{ duration: [1,2,3,4,5,6,7,8,9,10], resolution: ["540P","720P","1080P"] }],
    },
    {
      name: "kling-v3-omni",
      type: "video",
      modelName: "kling-v3-omni",
      mode: ["text","singleImage","startEndRequired","endFrameOptional",["videoReference","imageReference"]],
      audio: true,
      durationResolutionMap: [{ duration: [3,4,5,6,7,8,9,10,11,12,13,14,15], resolution: ["720P","1080P"] }],
    },
    {
      name: "kling-video-o1",
      type: "video",
      modelName: "kling-video-o1",
      mode: ["text","singleImage","startEndRequired","endFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [3,4,5,6,7,8,9,10,11,12,13,14,15], resolution: ["720P","1080P"] }],
    },
    {
      name: "kling-v3",
      type: "video",
      modelName: "kling-v3",
      mode: ["text","singleImage","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10], resolution: ["720P","1080P"] }],
    },
    {
      name: "kling-v2-6",
      type: "video",
      modelName: "kling-v2-6",
      mode: ["text","singleImage","startEndRequired","endFrameOptional","startFrameOptional"],
      audio: true,
      durationResolutionMap: [{ duration: [5,10], resolution: ["720P","1080P"] }],
    },
  ],
};
exports.vendor = vendor;

// ==================== 全局工具函数 ====================
declare const zipImage: (completeBase64: string, size: number) => Promise<string>;
declare const zipImageResolution: (completeBase64: string, width: number, height: number) => Promise<string>;
declare const mergeImages: (completeBase64: string[], maxSize?: string) => Promise<string>;
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (
  fn: () => Promise<{ completed: boolean; data?: string; error?: string }>,
  interval?: number,
  timeout?: number,
) => Promise<{ completed: boolean; data?: string; error?: string }>;

declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createGoogleGenerativeAI: any;
declare const exports: any;
declare const axios: any;
declare const FormData: any;
declare const Buffer: any;

// ==================== 工具函数 ====================
const getBaseUrl = () => "https://api.4022543.xyz";
const getTextUrl = () => `${getBaseUrl()}/v1`;
const getImageUrl = () => `${getBaseUrl()}/v1/images/generations`;

// 视频接口配置 - 不同模型使用不同接口
const getVeoVideoCreateUrl = () => `${getBaseUrl()}/v1/video/create`;
const getVeoVideoQueryUrl = () => `${getBaseUrl()}/v1/video/query?id={id}`;

// Vidu 视频接口 - v2 版本
const getViduText2VideoUrl = () => `${getBaseUrl()}/ent/v2/text2video`;
const getViduImage2VideoUrl = () => `${getBaseUrl()}/ent/v2/img2video`;
const getViduVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/ent/v2/tasks/${taskId}/creations`;

const getKlingVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/text2video`;
const getKlingImageVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/image2video`;
const getKlingMultiImageVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/multi-image2video`;
const getKlingOmniVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/omni-video`;
const getKlingText2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/text2video/${taskId}`;
const getKlingImage2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/image2video/${taskId}`;
const getKlingMultiImage2VideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/multi-image2video/${taskId}`;
const getKlingOmniVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/omni-video/${taskId}`;

const getDoubaoVideoCreateUrl = () => `${getBaseUrl()}/volc/v1/contents/generations/tasks`;
const getDoubaoVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/volc/v1/contents/generations/tasks/${taskId}`;

const getAuthorization = () => {
  if (!vendor.inputValues.apiKey) throw new Error("请到 api.4022543.xyz 获取 API Key");
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

const parseJsonResponse = async (response: any) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`接口返回了非 JSON 内容: ${text}`);
  }
};

const extractResult = (data: any): string | undefined => {
  const candidates = [
    data?.data?.[0]?.url,
    data?.data?.[0]?.b64_json,
    data?.data?.[0]?.video_url,
    data?.data?.url,
    data?.data?.b64_json,
    data?.data?.result_url,
    data?.data?.video_url,
    data?.result_url,
    data?.video_url,
    data?.url,
    data?.b64_json,
  ];
  return candidates.find((item) => typeof item === "string" && item.length > 0);
};

const throwIfNotOk = async (response: any, action: string) => {
  if (response.ok) return;
  const errorText = await response.text();
  throw new Error(`${action}失败，状态码: ${response.status}, 错误信息: ${errorText}`);
};

const getImageInput = (images: string[], imageModel: ImageModel) => {
  if (!images.length) return undefined;
  if (imageModel.modelName === "doubao-seededit-3-0-i2i-250628") {
    return images[0];
  }
  return images.length === 1 ? images[0] : images;
};

const getDoubaoImageSize = (imageConfig: ImageConfig, modelName: string) => {
  const pixelMap: Record<string, Record<string, string>> = {
    "1K": {
      "1:1": "1024x1024",
      "16:9": "1280x720",
      "9:16": "720x1280",
      "3:2": "1248x832",
      "2:3": "832x1248",
      "4:3": "1152x864",
      "3:4": "864x1152",
      "21:9": "1512x648",
    },
    "2K": {
      "1:1": "2048x2048",
      "16:9": "2848x1600",
      "9:16": "1600x2848",
      "3:2": "2496x1664",
      "2:3": "1664x2496",
      "4:3": "2304x1728",
      "3:4": "1728x2304",
      "21:9": "3136x1344",
    },
    "3K": {
      "1:1": "3072x3072",
      "16:9": "4096x2304",
      "9:16": "2304x4096",
      "3:2": "3744x2496",
      "2:3": "2496x3744",
      "4:3": "3456x2592",
      "3:4": "2592x3456",
      "21:9": "4704x2016",
    },
    "4K": {
      "1:1": "4096x4096",
      "16:9": "5504x3040",
      "9:16": "3040x5504",
      "3:2": "4992x3328",
      "2:3": "3328x4992",
      "4:3": "4704x3520",
      "3:4": "3520x4704",
      "21:9": "6240x2656",
    },
  };

  if (modelName === "doubao-seededit-3-0-i2i-250628") {
    return "adaptive";
  }
  if (modelName === "doubao-seedream-3-0-t2i-250415") {
    return pixelMap["1K"][imageConfig.aspectRatio] || "1024x1024";
  }
  if (modelName === "doubao-seedream-5-0-260128") {
    const size = imageConfig.size === "4K" ? "3K" : "2K";
    return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
  }
  if (modelName === "doubao-seedream-4-5-251128") {
    const size = imageConfig.size === "4K" ? "4K" : "2K";
    return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
  }
  const size = imageConfig.size;
  return pixelMap[size][imageConfig.aspectRatio] || pixelMap[size]["1:1"];
};

const getGenericImageSize = (imageConfig: ImageConfig, modelName: string) => {
  const normalizedAspectRatio = imageConfig.aspectRatio === "9:16" ? "9:16" : imageConfig.aspectRatio === "16:9" ? "16:9" : "1:1";

  if (modelName === "dall-e-3") {
    return normalizedAspectRatio === "16:9" ? "1792x1024" : normalizedAspectRatio === "9:16" ? "1024x1792" : "1024x1024";
  }
  if (modelName === "gpt-image-1" || modelName === "gpt-image-1.5") {
    return normalizedAspectRatio === "16:9" ? "1536x1024" : normalizedAspectRatio === "9:16" ? "1024x1536" : "1024x1024";
  }
  if (modelName === "grok-3-image") {
    return normalizedAspectRatio === "16:9" ? "1280x720" : normalizedAspectRatio === "9:16" ? "720x1280" : "960x960";
  }
  return normalizedAspectRatio === "16:9" ? "1536x1024" : normalizedAspectRatio === "9:16" ? "1024x1536" : "1024x1024";
};

const getQueryUrlWithId = (template: string, id: string) => {
  if (template.includes("{id}")) {
    return template.replace("{id}", encodeURIComponent(id));
  }
  const separator = template.includes("?") ? "&" : "?";
  return `${template}${separator}id=${encodeURIComponent(id)}`;
};

const getTaskStatus = (data: any) => String(data?.status || data?.data?.status || "").toLowerCase();

// ==================== 适配器函数 ====================
const textRequest: (textModel: TextModel) => { url: string; model: string } = (textModel) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");
  return createOpenAI({
    baseURL: getTextUrl(),
    apiKey: vendor.inputValues.apiKey.replace(/^Bearer\s+/, ""),
  }).chat(textModel.modelName);
};
exports.textRequest = textRequest;

interface ImageConfig {
  prompt: string;
  imageBase64: string[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

const imageRequest = async (imageConfig: ImageConfig, imageModel: ImageModel) => {
  const body: Record<string, any> = {
    model: imageModel.modelName,
    prompt: imageConfig.prompt,
    // response_format: "url",
  };

  if (imageModel.modelName.startsWith("doubao-")) {
    body.size = getDoubaoImageSize(imageConfig, imageModel.modelName);
    body.watermark = false;
    if (imageModel.modelName === "doubao-seedream-5-0-260128") {
      body.output_format = "png";
    }
    const imageInput = getImageInput(imageConfig.imageBase64 || [], imageModel);
    if (imageInput) {
      body.image = imageInput;
    }
    if (
      imageModel.modelName === "doubao-seedream-5-0-260128" ||
      imageModel.modelName === "doubao-seedream-4-5-251128" ||
      imageModel.modelName === "doubao-seedream-4-0-250828"
    ) {
      body.sequential_image_generation = "disabled";
    }
  } else {
    body.size = getGenericImageSize(imageConfig, imageModel.modelName);
    body.n = 1;
    if (imageModel.modelName === "dall-e-3") {
      body.quality = "standard";
      body.style = "vivid";
    }
    if (imageModel.modelName === "qwen-image-max") {
      body.size = "1024x1024";
    }
  }

  const response = await fetch(getImageUrl(), {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(response, "图片请求");

  const data = await parseJsonResponse(response);
  const result = extractResult(data);
  if (!result) {
    throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(data)}`);
  }
  return result;
};
exports.imageRequest = imageRequest;

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  imageBase64?: string[];
  audio?: boolean;
  mode:
    | "singleImage"
    | "startEndRequired"
    | "endFrameOptional"
    | "startFrameOptional"
    | "text"
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[] // 混合参考
}

// ==================== Veo 视频生成 ====================
const veoVideoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  const createBody: Record<string, any> = {
    model: videoModel.modelName,
    prompt: videoConfig.prompt,
    aspect_ratio: videoConfig.aspectRatio,//仅veo3支持，“16:9”或“9:16”
    enhance_prompt: true,
  };

  if (videoConfig.imageBase64?.length) {
    //当模型是带 veo2-fast-frames 最多支持两个，分别是首尾帧，
    // 当模型是 veo3-pro-frames 最多支持一个首帧，
    // 当模型是 veo2-fast-components 最多支持 3 个，此时图片为视频中的元素
    createBody.images = videoConfig.imageBase64;
  }

  const createResponse = await fetch(getVeoVideoCreateUrl(), {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.id || createData?.data?.id;
  if (!taskId) {
    throw new Error(`视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getQueryUrlWithId(getVeoVideoQueryUrl(), taskId), {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await throwIfNotOk(queryResponse, "视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = getTaskStatus(queryData);
    const videoUrl = extractResult(queryData);

    if (videoUrl) {
      return { completed: true, data: videoUrl };
    }
    if (["success", "succeeded", "completed"].includes(status)) {
      return { completed: true, data: videoUrl || taskId };
    }
    if (["failed", "failure", "error", "cancelled"].includes(status)) {
      return { completed: false, error: queryData?.fail_reason || queryData?.error?.message || "视频生成失败" };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data || result.data === taskId) {
    throw new Error("视频任务完成，但未返回可用下载地址");
  }
  return result.data;
};

// ==================== Vidu 视频生成 ====================
const viduVideoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  // 判断使用文生视频还是图生视频接口
  const hasImages = videoConfig.imageBase64 && videoConfig.imageBase64.length > 0;
  
  // 构建请求体
  const createBody: Record<string, any> = {
    model: videoModel.modelName,
    prompt: videoConfig.prompt,
    watermark: false,
  };

  // 添加可选参数
  if (videoConfig.aspectRatio) {
    createBody.aspect_ratio = videoConfig.aspectRatio;
  }
  if (videoConfig.resolution) {
    createBody.resolution = videoConfig.resolution.toLowerCase();
  }
  if (videoConfig.duration) {
    createBody.duration = videoConfig.duration;
  }
  // 添加背景音乐
  if (videoConfig.audio) {
    if(hasImages){
      createBody.audio = videoConfig.audio;
    }else{
      createBody.bgm = videoConfig.audio;
    }
  }
  // 如果有图片，使用图生视频接口
  if (hasImages) {
    // 图生视频只支持一张图片
    createBody.images = videoConfig.imageBase64.slice(0, 1);
  }

  const createUrl = hasImages ? getViduImage2VideoUrl() : getViduText2VideoUrl();
  
  const createResponse = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "Vidu视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.task_id;
  if (!taskId) {
    throw new Error(`Vidu视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getViduVideoQueryUrl(taskId), {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
        Accept: "application/json",
      },
    });
    await throwIfNotOk(queryResponse, "Vidu视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    
    // 根据 API 文档，查询响应结构为 { Response: { Status: "FINISH", AigcImageTask: { Output: { FileInfos: [...] } } } }
    const response = queryData?.Response;
    const status = response?.Status;
    const taskOutput = response?.AigcImageTask;
    
    // 获取视频 URL
    let videoUrl: string | undefined;
    if (taskOutput?.Output?.FileInfos && taskOutput.Output.FileInfos.length > 0) {
      videoUrl = taskOutput.Output.FileInfos[0].FileUrl;
    }

    // 状态判断
    if (status === "FINISH" && videoUrl) {
      return { completed: true, data: videoUrl };
    }
    if (status === "FINISH") {
      return { completed: true, data: videoUrl || taskId };
    }
    if (status === "FAILED" || status === "FAIL") {
      return { completed: false, error: taskOutput?.ErrorMessage || "Vidu视频生成失败" };
    }
    // 处理中状态：PENDING, PROCESSING, RUNNING 等
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error("Vidu视频任务完成，但未返回可用下载地址");
  }
  return result.data;
};

// ==================== Kling 视频生成 ====================
const klingVideoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  // 判断模型类型和输入类型
  const hasImages = videoConfig.imageBase64 && videoConfig.imageBase64.length > 0;
  const imageCount = videoConfig.imageBase64?.length || 0;
  const isOmniModel = videoModel.modelName.includes("omni") || videoModel.modelName.includes("video-o1");
  const isMultiImage = hasImages && imageCount > 1 && !isOmniModel;

  // 根据类型确定接口和模型名称
  let createUrl: string;
  let queryUrlFn: (taskId: string) => string;
  let modelName: string;

  if (isOmniModel) {
    // Omni 模型使用 omni-video 接口
    // API支持的模型：kling-video-o1, kling-v3-omni
    // modelName = videoModel.modelName.includes("v3") ? "kling-v3-omni" : "kling-video-o1";
    modelName = videoModel.modelName//放宽模型范围
    createUrl = getKlingOmniVideoCreateUrl();
    queryUrlFn = getKlingOmniVideoQueryUrl;
  } else if (isMultiImage) {
    // 多图参考使用 multi-image2video 接口
    // API支持的模型：kling-v1, kling-v1-5, kling-v1-6
    // 直接使用用户配置的模型名称
    modelName = videoModel.modelName;
    createUrl = getKlingMultiImageVideoCreateUrl();
    queryUrlFn = getKlingMultiImage2VideoQueryUrl;
  } else if (hasImages) {
    // 单图生视频使用 image2video 接口
    // API支持的模型：kling-v1, kling-v1-5, kling-v1-6, kling-v2-5-turbo
    // 直接使用用户配置的模型名称
    modelName = videoModel.modelName;
    createUrl = getKlingImageVideoCreateUrl();
    queryUrlFn = getKlingImage2VideoQueryUrl;
  } else {
    // 文生视频使用 text2video 接口
    // API支持的模型：kling-v1, kling-v1-5, kling-v1-6, kling-v2-5-turbo
    // 直接使用用户配置的模型名称
    modelName = videoModel.modelName;
    createUrl = getKlingVideoCreateUrl();
    queryUrlFn = getKlingText2VideoQueryUrl;
  }

  // 构建请求体
  const createBody: Record<string, any> = {
    model_name: modelName,
    prompt: videoConfig.prompt,
    duration: videoConfig.duration,
  };

  // Omni 模型需要额外的必需参数
  if (isOmniModel) {
    // 根据分辨率判断模式：
    // - 720P及以下使用 std（标准模式，性价比高）
    // - 1080P及以上使用 pro（专家模式，高品质）
    const resolution = videoConfig.resolution?.toLowerCase() || "";
    const isHighQuality = resolution.includes("1080") || resolution.includes("2k") || resolution.includes("4k");
    createBody.mode = isHighQuality ? "pro" : "std";
    createBody.multi_shot = false;
  }
  // 生成视频时是否同时生成声音
  if (videoConfig.audio) {
    createBody.sound = videoConfig.audio ? "on" : "off";
  }
  // 文生视频或者 Omni 模型需要 aspect_ratio
  // if (!hasImages || isOmniModel) {
  //   createBody.aspect_ratio = videoConfig.aspectRatio;
  // }
  createBody.aspect_ratio = videoConfig.aspectRatio;
  // 处理图片输入
  if (isOmniModel && hasImages) {
    // Omni 模型使用 image_list
    // 根据 mode 判断图片用途：
    // - singleImage: 单图参考（不设置 type）
    // - endFrameOptional: 首尾帧（尾帧可选）→ 第1张是首帧，有第2张则是尾帧
    // - startFrameOptional: 首尾帧（首帧可选）→ 但API暂时不支持仅尾帧，所以第1张是首帧，有第2张则是尾帧
    // - startEndRequired: 首尾帧（两张都得有）
    // - 其他: 参考图 (不设置 type)
    const mode = videoConfig.mode;
    // 过滤出图片文件（排除视频文件）
    const images = videoConfig.imageBase64!.filter(file =>
      file.startsWith("data:image") || (!file.startsWith("data:video") && !file.startsWith("data:audio"))
    );
    
    if (mode === "singleImage") {
      // 单图参考（不设置 type）
      createBody.image_list = [{ image: images[0] }];
    } else if (mode === "endFrameOptional") {
      // 首尾帧（尾帧可选）：第1张是首帧，有第2张则是尾帧
      if (images.length >= 2) {
        createBody.image_list = [
          { image: images[0], type: "first_frame" },
          { image: images[1], type: "end_frame" },
        ];
      } else {
        createBody.image_list = [{ image: images[0], type: "first_frame" }];
      }
    } else if (mode === "startFrameOptional") {
      // 首尾帧（首帧可选）：但API暂时不支持仅尾帧，所以第1张是首帧，有第2张则是尾帧
      // 如果用户真的只传了1张且想作为尾帧，目前API不支持，只能作为首帧处理
      if (images.length >= 2) {
        createBody.image_list = [
          { image: images[0], type: "first_frame" },
          { image: images[1], type: "end_frame" },
        ];
      } else {
        // 只有1张图，API暂时不支持仅尾帧，作为首帧处理
        createBody.image_list = [{ image: images[0], type: "first_frame" }];
      }
    } else if (mode === "startEndRequired" && images.length >= 2) {
      // 首尾帧（两张都得有）
      createBody.image_list = [
        { image: images[0], type: "first_frame" },
        { image: images[1], type: "end_frame" },
      ];
    } else {
      // 其他情况作为参考图（不设置 type）
      createBody.image_list = images.map(img => ({ image: img }));
    }
    // 尚未支持视频参考
    if(Array.isArray(videoConfig.mode)){
      //如果是混合参考，需要设置 video_list 参数
      //判断imageBase64里是否有视频文件
      // if(videoConfig.imageBase64?.includes("video")){
      //   createBody.video_list = videoConfig.imageBase64.filter(video => video.includes("video"));
      // }
      // 尚未支持视频参考
    }

  } else if (isMultiImage) {
    // 多图参考使用 image_list
    createBody.image_list = videoConfig.imageBase64!.map(img => ({ image: img }));
  } else if (hasImages) {
    // 单图生视频
    createBody.image = videoConfig.imageBase64![0];
  } 
  

  const createResponse = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "Kling视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.data?.task_id;
  if (!taskId) {
    throw new Error(`Kling视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(queryUrlFn(taskId), {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await throwIfNotOk(queryResponse, "Kling视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = String(queryData?.data?.task_status || "").toLowerCase();
    const videos = queryData?.data?.task_result?.videos;
    const videoUrl = videos && videos.length > 0 ? videos[0].url : undefined;

    if (videoUrl && status === "success") {
      return { completed: true, data: videoUrl };
    }
    if (status === "success") {
      return { completed: true, data: videoUrl || taskId };
    }
    if (["failed", "failure", "error"].includes(status)) {
      return { completed: false, error: queryData?.data?.task_status_msg || "Kling视频生成失败" };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error("Kling视频任务完成，但未返回可用下载地址");
  }
  return result.data;
};

// ==================== 豆包 Seedance 视频生成 ====================
const doubaoVideoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  // 构建参数字符串（追加到提示词后面）
  const params: string[] = [];
  if (videoConfig.resolution) {
    params.push(`--resolution ${videoConfig.resolution.toLowerCase()}`);
  }
  if (videoConfig.aspectRatio) {
    params.push(`--ratio ${videoConfig.aspectRatio}`);
  }
  if (videoConfig.duration) {
    params.push(`--duration ${videoConfig.duration}`);
  }
  params.push("--watermark false");
  
  // 构建 content 数组
  const content: any[] = [
    { 
      type: "text", 
      text: `${videoConfig.prompt} ${params.join(" ")}`.trim() 
    }
  ];

  // 添加图片到 content
  if (videoConfig.imageBase64?.length) {
    if (videoConfig.imageBase64.length === 1) {
      // 单图 - 首帧（不需要 role 字段）
      content.push({
        type: "image_url",
        image_url: { url: videoConfig.imageBase64[0] }
      });
    } else if (videoConfig.imageBase64.length >= 2) {
      // 多图 - 首帧和尾帧（首帧不需要 role，尾帧需要 role: "last_frame"）
      content.push({
        type: "image_url",
        image_url: { url: videoConfig.imageBase64[0] }
      });
      content.push({
        type: "image_url",
        image_url: { url: videoConfig.imageBase64[1] },
        role: "last_frame"
      });
    }
  }

  const createBody: Record<string, any> = {
    model: videoModel.modelName,
    content: content,
    generate_audio: videoConfig.audio !== false,
  };

  const createResponse = await fetch(getDoubaoVideoCreateUrl(), {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBody),
  });
  await throwIfNotOk(createResponse, "豆包视频任务创建");

  const createData = await parseJsonResponse(createResponse);
  const taskId = createData?.id;
  if (!taskId) {
    throw new Error(`豆包视频任务创建失败: ${JSON.stringify(createData)}`);
  }

  const result = await pollTask(async () => {
    const queryResponse = await fetch(getDoubaoVideoQueryUrl(taskId), {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await throwIfNotOk(queryResponse, "豆包视频查询");

    const queryData = await parseJsonResponse(queryResponse);
    const status = String(queryData?.status || "").toLowerCase();
    
    // 豆包响应格式: content.video_url
    const videoUrl = queryData?.content?.video_url;

    if (videoUrl && status === "succeeded") {
      return { completed: true, data: videoUrl };
    }
    if (status === "succeeded") {
      return { completed: true, data: videoUrl || taskId };
    }
    if (["failed", "failure", "error"].includes(status)) {
      return { completed: false, error: queryData?.fail_reason || "豆包视频生成失败" };
    }
    return { completed: false };
  }, 5000, 10 * 60 * 1000);

  if (result.error) throw new Error(result.error);
  if (!result.data) {
    throw new Error("豆包视频任务完成，但未返回可用下载地址");
  }
  return result.data;
};

// ==================== 视频请求分发 ====================
const videoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  const modelName = videoModel.modelName;

  // 根据模型名称分发到不同的处理函数
  if (modelName.startsWith("veo")) {
    return veoVideoRequest(videoConfig, videoModel);
  } else if (modelName.startsWith("viduq") || modelName.startsWith("vidu")) {
    return viduVideoRequest(videoConfig, videoModel);
  } else if (modelName.startsWith("kling")) {
    return klingVideoRequest(videoConfig, videoModel);
  } else if (modelName.startsWith("doubao-seedance")) {
    return doubaoVideoRequest(videoConfig, videoModel);
  }

  // 默认使用 Veo 接口
  return veoVideoRequest(videoConfig, videoModel);
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
  return null;
};
exports.ttsRequest = ttsRequest;
