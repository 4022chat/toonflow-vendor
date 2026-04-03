// ==================== 类型定义 ====================
// 文本模型
interface TextModel {
  name: string; // 显示名称
  modelName: string;
  type: "text";
  multimodal: boolean; // 前端显示用
  tool: boolean; // 前端显示用
}

// 图像模型
interface ImageModel {
  name: string; // 显示名称
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
  associationSkills?: string; // 关联技能，多个技能用逗号分隔
}

// 视频模型
interface VideoModel {
  name: string; // 显示名称
  modelName: string; // 全局唯一
  type: "video";
  mode: (
    | "singleImage" // 单图
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
    title: string; // 显示名称
    voice: string; // 说话人
  }[];
}

// 供应商配置
interface VendorConfig {
  id: string;
  version: number;
  icon?: string; // 仅支持 base64 格式
  author: string;
  description?: string; // md5 格式
  name: string;
  inputs: {
    key: string;
    label: string;
    type: "text" | "password" | "url";
    required: boolean;
    placeholder?: string;
  }[];
  inputValues: Record<string, string>;
  models: (ImageModel | VideoModel)[];
}

// ==================== 供应商数据 ====================
const vendor: VendorConfig = {
  id: "jm.4022543.xyz",
  version: 1,
  author: "四零二二",
  description: "兼容JM2API项目的接口，支持文生图、图生图、普通视频与 SD2.0 多模态视频生成。\n\n 使用该方案，您需要先拥有一个JM的API服务，才能使用该适配器。\n\n API服务部署教程：https://tf.4022543.xyz\n\n⚠️**警告：该方案有可能会被封号，请慎重！！！**",
  name: "JM-API",
  inputs: [
    { key: "apiKey", label: "SessionID / API密钥", type: "password", required: true },
    { key: "baseUrl", label: "基础URL", type: "text", required: true, placeholder: "例如 http://127.0.0.1:8000/v1" },
    // { key: "text", label: "文本接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1" },
    { key: "image", label: "图片接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/images/generations" },
    { key: "video", label: "视频接口", type: "url", required: false, placeholder: "默认为 {baseUrl}/v1/videos/generations" },
    { key: "videoQuery", label: "通用视频任务查询", type: "url", required: false, placeholder: "如非必要请勿更改" },
  ],
  inputValues: {
  "apiKey": "",
  "baseUrl": "http://127.0.0.1:8000/v1",
  "image": "http://127.0.0.1:8000/v1/images/generations",
  "video": "http://127.0.0.1:8000/v1/videos/generations/async",
  "videoQuery": "http://127.0.0.1:8000/v1/videos/generations/async/{id}"
},
  models: [
  {
    "name": "jm 5.0",
    "type": "image",
    "modelName": "jimeng-5.0",
    "mode": [
      "text",
      "singleImage",
      "multiReference"
    ],
    "associationSkills": ""
  },
  {
    "name": "jm 4.6",
    "type": "image",
    "modelName": "jimeng-4.6",
    "mode": [
      "text",
      "singleImage",
      "multiReference"
    ],
    "associationSkills": ""
  },
  {
    "name": "jm 4.5",
    "type": "image",
    "modelName": "jimeng-4.5",
    "mode": [
      "text",
      "singleImage",
      "multiReference"
    ],
    "associationSkills": ""
  },
  {
    "name": "jm 4.1",
    "type": "image",
    "modelName": "jimeng-4.1",
    "mode": [
      "text",
      "singleImage",
      "multiReference"
    ],
    "associationSkills": ""
  },
  {
    "name": "jm 4.0",
    "type": "image",
    "modelName": "jimeng-4.0",
    "mode": [
      "text",
      "singleImage",
      "multiReference"
    ],
    "associationSkills": ""
  },
  {
    "name": "SD 2.0",
    "type": "video",
    "modelName": "jimeng-video-seedance-2.0",
    "mode": [
      "singleImage",
      "startEndRequired",
      "endFrameOptional",
      "startFrameOptional",
      "text",
      ["videoReference", "imageReference", "audioReference", "textReference"]
    ],
    "associationSkills": "",
    "audio": true,
    "durationResolutionMap": [
      {
        "duration": [
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "resolution": [
          "720p",
          "1080p"
        ]
      }
    ]
  },
  {
    "name": "SD 2.0 Fast",
    "modelName": "jimeng-video-seedance-2.0-fast",
    "type": "video",
    "mode": [
      "singleImage",
      "startEndRequired",
      "endFrameOptional",
      "startFrameOptional",
      "text",
      ["videoReference", "imageReference", "audioReference", "textReference"]
    ],
    "associationSkills": "",
    "audio": true,
    "durationResolutionMap": [
      {
        "duration": [
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "resolution": [
          "720p",
          "1080p"
        ]
      }
    ]
  },
  {
    "name": "SD 1.5",
    "modelName": "jimeng-video-3.5-pro",
    "type": "video",
    "mode": [
      "text","singleImage","startEndRequired","endFrameOptional","startFrameOptional"
    ],
    "associationSkills": "",
    "audio": false,
    "durationResolutionMap": [
      {
        "duration": [
          5,
          10,
          12
        ],
        "resolution": [
          "720p",
          "1080p"
        ]
      }
    ]
  }
],
};
exports.vendor = vendor;

// ==================== 全局工具函数 ====================
// Axios实例
// 压缩图片大小(1MB = 1 * 1024 * 1024)
declare const zipImage: (completeBase64: string, size: number) => Promise<string>;
// 压缩图片分辨率
declare const zipImageResolution: (completeBase64: string, width: number, height: number) => Promise<string>;
// 多图拼接乘单图 maxSize 最大输出大小，默认为 10mb
declare const mergeImages: (completeBase64: string[], maxSize?: string) => Promise<string>;
// Url转Base64
declare const urlToBase64: (url: string) => Promise<string>;
// 轮询函数
declare const pollTask: (
  fn: () => Promise<{ completed: boolean; data?: string; error?: string }>,
  interval?: number,
  timeout?: number,
) => Promise<{ completed: boolean; data?: string; error?: string }>;

// 供应商文档：https://ai-sdk.dev/providers/ai-sdk-providers
declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createGoogleGenerativeAI: any;
declare const exports: any;
declare const FormData: any;
declare const Buffer: any;

// 请求方法
declare const axios: any;

// ==================== 工具函数 ====================
const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");
const getTextUrl = () => vendor.inputValues.text || `${getBaseUrl()}/v1`;
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

// ==================== 适配器函数 ====================

// 文本请求函数
const textRequest: (textModel: TextModel) => { url: string; model: string } = (textModel) => {
  throw new Error("不支持文本请求，可以更换其他供应商");
};
exports.textRequest = textRequest;

// 图片请求函数
interface ImageConfig {
  prompt: string; // 图片提示词
  imageBase64: string[]; // 输入图片
  size: "1K" | "2K" | "4K"; // 图片尺寸
  aspectRatio: `${number}:${number}`; // 长宽比
}

const imageRequest = async (imageConfig: ImageConfig, imageModel: ImageModel) => {
  const headers = { Authorization: getAuthorization() };
  const hasImages = Array.isArray(imageConfig.imageBase64) && imageConfig.imageBase64.length > 0;
  const resolution = imageConfig.size.toLowerCase();

  if(resolution == "1k"){
    throw new Error(`JM-4.0以上系列不支持 1K 尺寸`);
  }

  if (hasImages) {
    const formData = new FormData();
    formData.append("model", imageModel.modelName);
    formData.append("prompt", imageConfig.prompt);
    formData.append("ratio", imageConfig.aspectRatio);
    formData.append("resolution", resolution);
    formData.append("response_format", "url");
    formData.append("sample_strength", "0.5");
    appendBase64Files(formData, "images", imageConfig.imageBase64, "image");

    const response = await axios.post(getImageUrl(), formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    const result = extractResult(response.data);
    if (!result) throw new Error(`图片生成成功但未返回可用结果: ${JSON.stringify(response.data)}`);
    return result;
  }

  const response = await fetch(getImageUrl(), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: imageModel.modelName,
      prompt: imageConfig.prompt,
      ratio: imageConfig.aspectRatio,
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
exports.imageRequest = imageRequest;

interface VideoConfig {
  duration: number; // 视频时长，单位秒
  resolution: string; // 视频分辨率"480p" | "720p" | "1080p"
  aspectRatio: "16:9" | "9:16"; // 视频长宽比
  prompt: string; // 视频提示词
  fileBase64?: string[]; // 文件base64，包含图片/视频/音频
  audio?: boolean;
  mode:
    | "singleImage" // 单图
    | "multiImage" // 多图模式
    | "gridImage" // 网格单图（传入一张图片，但该图片是网格图）
    | "startEndRequired" // 首尾帧（两张都得有）
    | "endFrameOptional" // 首尾帧（尾帧可选）
    | "startFrameOptional" // 首尾帧（首帧可选）
    | "text" // 文本生视频
    | ("videoReference" | "imageReference" | "audioReference" | "textReference")[] // 混合参考
}

const videoRequest = async (videoConfig: VideoConfig, videoModel: VideoModel) => {
  const headers = { Authorization: getAuthorization() };
  const hasFiles = Array.isArray(videoConfig.fileBase64) && videoConfig.fileBase64.length > 0;

  // 第一步：提交异步任务
  let taskId: string;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("model", videoModel.modelName);
    if (videoConfig.prompt) formData.append("prompt", videoConfig.prompt);
    formData.append("ratio", videoConfig.aspectRatio);
    formData.append("resolution", videoConfig.resolution);
    formData.append("duration", String(videoConfig.duration));
    appendBase64Files(formData, "files", videoConfig.fileBase64 || [], "material");

    const response = await axios.post(getVideoUrl(), formData, {
      headers: { ...headers, ...(typeof formData.getHeaders === "function" ? formData.getHeaders() : {}) },
    });
    const data = response.data;
    taskId = data?.task_id ?? data?.taskId ?? data?.id;
    if (!taskId) throw new Error(`视频任务提交失败: ${JSON.stringify(data)}`);
  } else {
    const response = await fetch(getVideoUrl(), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: videoModel.modelName,
        prompt: videoConfig.prompt,
        ratio: videoConfig.aspectRatio,
        resolution: videoConfig.resolution,
        duration: videoConfig.duration,
        ...(videoConfig.fileBase64?.length ? { file_paths: videoConfig.fileBase64 } : {}),
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

  // 第二步：轮询查询任务结果
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

    // 根据 API 文档，status 可能是 succeeded/processing/failed
    switch (status) {
      case "succeeded":
      case "completed":
      case "SUCCESS":
      case "success": {
        const result = extractResult(queryData);
        if (result) {
          return { completed: true, data: result };
        }
        // 如果没有提取到结果，可能是 data 结构不同，尝试其他字段
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
        return { completed: false, error: errorMsg };
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
