/**
 * 柏拉图 API 供应商适配
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
    | (
        | `videoReference:${number}`
        | `imageReference:${number}`
        | `audioReference:${number}`
    )[];

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
    id: string; //唯一ID，作为文件名存储用户磁盘上，禁止符号
    version: string; //版本号，格式为x.y，需遵守语义化版本控制
    name: string; //供应商名称
    author: string; //作者
    description?: string; //描述，支持Markdown格式
    icon?: string; //图标，仅支持Base64格式，建议尺寸为128x128像素
    inputs: {
        key: string;
        label: string;
        type: "text" | "password" | "url";
        required: boolean;
        placeholder?: string;
    }[];
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

declare const axios: any; // HTTP请求库
declare const logger: (msg: string) => void; // 日志函数
declare const jsonwebtoken: any; // JWT处理库
declare const zipImage: (base64: string, size: number) => Promise<string>; // 图片压缩函数，返回有头base64字符串
declare const zipImageResolution: (
    base64: string,
    w: number,
    h: number,
) => Promise<string>; // 图片分辨率调整函数，返回有头base64字符串
declare const mergeImages: (
    base64Arr: string[],
    maxSize?: string,
) => Promise<string>; // 图片合成函数，返回有头base64字符串
declare const urlToBase64: (url: string) => Promise<string>; // URL转Base64函数，返回有头base64字符串
declare const pollTask: (
    fn: () => Promise<PollResult>,
    interval?: number,
    timeout?: number,
) => Promise<PollResult>; // 轮询函数，fn为异步函数，interval为轮询间隔，timeout为超时时间，返回fn的结果
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
    textRequest: (m: TextModel, t: boolean, tl: 0 | 1 | 2 | 3) => any; //文本模型
    imageRequest: (c: ImageConfig, m: ImageModel) => Promise<string>; //图片模型，返回有头base64字符串
    videoRequest: (c: VideoConfig, m: VideoModel) => Promise<string>; //视频模型，返回有头base64字符串
    ttsRequest: (c: TTSConfig, m: TTSModel) => Promise<string>; //（暂未开放）语音模型，返回有头base64字符串
    checkForUpdates?: () => Promise<{
        hasUpdate: boolean;
        latestVersion: string;
        notice: string;
    }>; //检查更新函数，返回是否有更新和最新版本号和更公告（支持Markdown格式）
    updateVendor?: () => Promise<string>; //更新函数，返回最新的代码文本
};

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
    id: "bltcy",
    version: "2.1.3",
    author: "四零二二",
    name: "柏拉图",
    description:"支持seedance2.0视频生成，价格比官方更低\n\n已接入最新的GPT5.5 和GPT Image 2.0生图模型\n\n内置claude/GPT/gemini等模型\n\n香蕉4K生图最低只要0.1/次，[注册即送体验次数](https://api.bltcy.ai/register?aff=ppJQ120196)\n\n 只需一个key即可接入所有模型，邀请好友可返点。[点这里去注册](https://api.bltcy.ai/register?aff=ppJQ120196)",
    inputs: [
        {
            key: "apiKey",
            label: "API密钥",
            type: "password",
            required: true,
            placeholder: "默认的API Key",
        },
        {
            key: "textKey",
            label: "文本 API 密钥",
            type: "password",
            required: false,
            placeholder: "不填则默认使用 API 密钥",
        },
        {
            key: "imageKey",
            label: "图像 API 密钥",
            type: "password",
            required: false,
            placeholder: "不填则默认使用 API 密钥",
        },
        {
            key: "videoKey",
            label: "视频 API 密钥",
            type: "password",
            required: false,
            placeholder: "不填则默认使用 API 密钥",
        },
        {
            key: "ttsKey",
            label: "语音 API 密钥",
            type: "password",
            required: false,
            placeholder: "不填则默认使用 API 密钥",
        },
        {
            key: "baseUrl",
            label: "请求地址",
            type: "text",
            required: false,
            placeholder: "不填写则使用默认值：https://api.bltcy.ai",
        },
    ],
    inputValues: {
        apiKey: "",
        textKey: "",
        imageKey: "",
        videoKey: "",
        ttsKey: "",
        baseUrl: "https://api.bltcy.ai",
    },
    models: [
        {name: "Seedance 2.0",type: "video",modelName: "doubao-seedance-2-0-260128",mode: ["text", "endFrameOptional","startEndRequired",["videoReference:1","imageReference:9","audioReference:1"]],audio: true,durationResolutionMap: [{duration: [4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p", "1080p"]}]},
        {name: "Seedance 2.0 Fast",type: "video",modelName: "doubao-seedance-2-0-fast-260128",mode: ["text", "endFrameOptional","startEndRequired",["videoReference:1","imageReference:9","audioReference:1"]],audio: true,durationResolutionMap: [{duration: [4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p", "1080p"]}]},
        {name: "GPT Image 2.0",type: "image",modelName: "gpt-image-2",mode: ["text", "singleImage", "multiReference"]},
        {name: "Gemini-3.1-flash-image",type: "image",modelName: "gemini-3.1-flash-image-preview",mode: ["text", "singleImage", "multiReference"]},
        {name: "Gemini-3-pro-image",type: "image",modelName: "gemini-3-pro-image-preview",mode: ["text", "singleImage", "multiReference"]},
        {name: "Nano Banana Pro",type: "image",modelName: "nano-banana-pro",mode: ["text", "singleImage", "multiReference"]},
        {name: "豆包 Seedream 5.0",type: "image",modelName: "doubao-seedream-5-0-260128",mode: ["text", "singleImage", "multiReference"]},
        {name: "豆包 Seedream 4.5",type: "image",modelName: "doubao-seedream-4-5-251128",mode: ["text", "singleImage", "multiReference"]},
        {name: "GPT Image 1.5",type: "image",modelName: "gpt-image-1.5",mode: ["text", "singleImage", "multiReference"]},
        {name: "deepseek-v4-flash",type: "text",modelName: "deepseek-v4-flash",think: true},
        {name: "deepseek-v4-pro",type: "text",modelName: "deepseek-v4-pro",think: true},
        {name: "Gemini-3.1-flash-lite-preview",type: "text",modelName: "gemini-3.1-flash-lite-preview",think: true},
        {name: "Gemini-3.1-pro-preview",type: "text",modelName: "gemini-3.1-pro-preview",think: true},
        {name: "Gemini-3.1-pro-preview-customtools",type: "text",modelName: "gemini-3.1-pro-preview-customtools",think: false},
        {name: "GPT-5.5",type: "text",modelName: "gpt-5.5",think: true},
        {name: "GPT-5-codex",type: "text",modelName: "gpt-5-codex",think: true,},
        {name: "GPT-5",type: "text",modelName: "gpt-5",think: false},
        {name: "claude-sonnet-4-5",type: "text",modelName: "claude-sonnet-4-5-20250929",think: true},
        {name: "claude-opus-4-6",type: "text",modelName: "claude-opus-4-6",think: true},
        {name: "claude-sonnet-4-6",type: "text",modelName: "claude-sonnet-4-6",think: true},
        {name: "claude-opus-4-7",type: "text",modelName: "claude-opus-4-7",think: true},
        {name: "Seedance 1.5 Pro",type: "video",modelName: "doubao-seedance-1-5-pro-251215",mode: ["text", "endFrameOptional","startEndRequired"],durationResolutionMap: [{duration: [4, 5, 6, 7, 8, 9, 10, 11, 12],resolution: ["480p", "720p", "1080p"]}],audio: true},
        {name: "veo3.1-pro-4k",type: "video",modelName: "veo3.1-pro-4k",mode: ["text", "endFrameOptional"],audio: "optional",durationResolutionMap: [{duration: [5,10],resolution: ["1080p"]}]},
        {name: "veo3.1-pro",type: "video",modelName: "veo3.1-pro",mode: ["text", "endFrameOptional"],audio: "optional",durationResolutionMap: [{duration: [5,10],resolution: ["720p","1080p"]}]},
        {name: "kling-v3-omni",type: "video",modelName: "kling-v3-omni",mode: ["text","endFrameOptional",["videoReference:1","imageReference:4"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p","1080p"]}]},
        {name: "kling-video-o1",type: "video",modelName: "kling-video-o1",mode: ["text","endFrameOptional",["videoReference:1","imageReference:4"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p","1080p"]}]},
        //模型名称匹配不上
        // {name: "kling-v2-6",type: "video",modelName: "kling-v2-6",mode: ["text","endFrameOptional"],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p","1080p"]}]},
        // {name: "kling-v2-5-turbo",type: "video",modelName: "kling-v2-5-turbo",mode: ["text","endFrameOptional"],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15],resolution: ["720p","1080p"]}]},
        {name: "viduq3-pro",type: "video",modelName: "viduq3-pro",mode: ["text","singleImage", "endFrameOptional",["imageReference:3"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],resolution: ["720p","1080p"]}]},
        {name: "viduq3-turbo",type: "video",modelName: "viduq3-turbo",mode: ["text","singleImage", "endFrameOptional",["imageReference:3","videoReference:1"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],resolution: ["720p","1080p"]}]},
        {name: "viduq3-pro-fast",type: "video",modelName: "viduq3-pro-fast",mode: ["singleImage"],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],resolution: ["720p","1080p"]}]},
        {name: "viduq2-pro",type: "video",modelName: "viduq2-pro",mode: ["singleImage", "endFrameOptional",["imageReference:3"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10],resolution: ["720p","1080p"]}]},
        {name: "viduq2-turbo",type: "video",modelName: "viduq2-turbo",mode: ["singleImage", "endFrameOptional"],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10],resolution: ["720p","1080p"]}]},
        {name: "viduq2-pro-fast",type: "video",modelName: "viduq2-pro-fast",mode: ["singleImage"],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10],resolution: ["720p","1080p"]}]},
        //万象疑似模型名称匹配不上
        {name: "万象 2.5",type: "video",modelName: "wan2.5-i2v-preview",mode: ["text", "singleImage",["imageReference:1","audioReference:1"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10],resolution: ["720p","1080p"]}]},
        {name: "万象 2.6-r2v",type: "video",modelName: "wan2.6-r2v",mode: ["text", "singleImage",["imageReference:1","audioReference:1"]],audio: "optional",durationResolutionMap: [{duration: [3,4,5,6,7,8,9,10],resolution: ["720p","1080p"]}]},
    ],
};  

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = () => vendor.inputValues.baseUrl || "https://api.bltcy.ai";
const getTextUrl = () => `${getBaseUrl()}/v1`;
const getImageUrl = (modelName: string, isEdit: boolean) => {

    // OpenAI 兼容格式 (Gemini/GPT/Claude/Qwen)，指定模型，无论是文生图还是图生图都走这个接口
    const openaiCompatibleModels = ["gpt-","dall-e-","flux-"];
    // Google Gemini 官方格式
    if (modelName.startsWith("gemini-") && modelName.includes("-image")) {
        return `${getBaseUrl()}/v1beta/models/${modelName}:generateContent`;
    }else if (!modelName.startsWith("gpt-image-") && openaiCompatibleModels.some((p) => modelName.startsWith(p))) {
        // gpt-image-2 不走chat/completions 接口，走 v1/images/generations 接口
        return `${getBaseUrl()}/v1/chat/completions`;
    }else if (isEdit && (modelName.includes("-image")) && !modelName.includes("gpt-image-2")  && !modelName.includes("kling-") && modelName != "qwen-image") {
        // 需要指定模型使用编辑接口，这里还不是很完善
        // 4o模型是异步的
        // 这个接口是 multipart/form-data 格式请求
        return `${getBaseUrl()}/v1/images/edits`;
    }
    return `${getBaseUrl()}/v1/images/generations`;
};

// =======================Seedance 视频=====================================
const getSeedanceVideoCreateUrl = () => `${getBaseUrl()}/seedance/v3/contents/generations/tasks`;
const getSeedanceVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/seedance/v3/contents/generations/tasks/${taskId}`;

// =======================通用视频接口，支持 veo,wan,grok 等视频生成模型=====================================
const getVideoCreateUrl = () => `${getBaseUrl()}/v2/videos/generations`;
const getVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/v2/videos/generations/${taskId}`;

// =======================可灵视频接口=====================================
// omni-video 视频生成接口
const getKlingOmniVideoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/omni-video`;
const getKlingOmniVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/omni-video/${taskId}`;
// text2video 视频生成接口
const getKlingText2videoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/text2video`;//文本生视频，即文本
const getKlingText2videoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/text2video/${taskId}`;//文本生视频，即文本
// img2video 视频生成接口
const getKlingImg2videoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/image2video`;//图生视频，即首帧
const getKlingImg2videoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/image2video/${taskId}`;//图生视频，即首帧
// multi-image2video 多图参考视频生成接口
const getKlingMultiImage2videoCreateUrl = () => `${getBaseUrl()}/kling/v1/videos/multi-image2video`;//多图生视频，即多图
const getKlingMultiImage2videoQueryUrl = (taskId: string) => `${getBaseUrl()}/kling/v1/videos/multi-image2video/${taskId}`;//多图生视频，即多图

// =======================Vidu 视频接口=====================================
const getViduText2videoCreateUrl = () => `${getBaseUrl()}/vidu/v2/text2video`;//文本生视频，即文本
const getViduImg2videoCreateUrl = () => `${getBaseUrl()}/vidu/v2/img2video`;//图生视频，即首帧
const getViduStartEnd2videoCreateUrl = () => `${getBaseUrl()}/vidu/v2/start-end2video`;//图生视频，即首尾帧
const getViduReference2videoCreateUrl = () => `${getBaseUrl()}/vidu/v2/reference2video`;//参考生视频，即参考图
const getViduVideoQueryUrl = (taskId: string) => `${getBaseUrl()}/vidu/v2/tasks/${taskId}/creations`;//视频查询

// =======================通用工具函数=====================================
/**
 * 提取纯 base64 内容（去掉 data URI 前缀）
 * 适用于 Kling 等需要纯 base64 的 API
 * @param img - 可能包含 data URI 前缀的图片字符串
 * @returns 纯 base64 字符串（清理空白字符后）
 */
const extractPureBase64 = (img: string): string => {
    let base64 = img;
    if (img.startsWith("data:")) {
        // 去掉 data URI 前缀，只保留 base64 内容
        base64 = img.split(",")[1] || img;
    }
    // 清理空白字符
    return base64.replace(/\s/g, "");
};

/**
 * 转换为 data URI 格式（添加 data:image/jpeg;base64, 前缀）
 * 适用于需要完整 data URI 的 API
 * @param img - 可能包含或不包含 data URI 前缀的图片字符串
 * @param mimeType - MIME 类型，默认为 image/jpeg
 * @returns 完整的 data URI 字符串
 */
const toDataUri = (img: string, mimeType: string = "image/jpeg"): string => {
    if (img.startsWith("data:")) {
        return img;
    }
    const cleanImg = img.replace(/\s/g, "");
    return `data:${mimeType};base64,${cleanImg}`;
};

/**
 * 从 data URI 中提取 base64 内容和 MIME 类型
 * @param img - 可能包含 data URI 前缀的图片字符串
 * @returns 包含 base64 数据和 MIME 类型的对象
 */
const extractBase64AndMimeType = (img: string): { base64: string; mimeType: string } => {
    if (img.startsWith("data:")) {
        const mimeType = img.match(/data:(.*?);/)?.[1] || "image/png";
        const base64 = img.split(",")[1] || img;
        return { base64: base64.replace(/\s/g, ""), mimeType };
    }
    // 根据 base64 开头特征判断 MIME 类型
    const cleanImg = img.replace(/\s/g, "");
    const mimeType = cleanImg.startsWith("iVBOR") ? "image/png" : "image/jpeg";
    return { base64: cleanImg, mimeType };
};

const getApiKey = (type?: "image" | "video" | "text" | "tts"): string => {
    const keyMap: Record<string, string> = {
        image: "imageKey",
        video: "videoKey",
        text: "textKey",
        tts: "ttsKey",
    };
    const specificKey = type ? vendor.inputValues[keyMap[type]] : "";
    return specificKey || vendor.inputValues.apiKey;
};

const getAuthorization = (type?: "image" | "video" | "text" | "tts") => {
    const apiKey = getApiKey(type);
    if (!apiKey) throw new Error("缺少 API Key");
    return apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;
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
    const chatContent = data?.choices?.[0]?.message?.content;
    if (typeof chatContent === "string") {
        const mdMatch = chatContent.match(/!\[.*?\]\((.*?)\)/);
        if (mdMatch) return mdMatch[1];

        const urlMatch = chatContent.match(/https?:\/\/[^\s"']+/);
        if (urlMatch) return urlMatch[0];

        return chatContent;
    }

    const candidates = [
        // Vidu API 格式: creations[0].url
        data?.creations?.[0]?.url,
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
        data?.output,
        data?.data?.output,
        data?.data?.[0]?.output,
        data?.content?.video_url,

    ];
    return candidates.find((item) => typeof item === "string" && item.length > 0);
};

const throwIfNotOk = async (response: any, action: string) => {
    if (response.ok) return;
    const errorText = await response.text();
    throw new Error(
        `${action}失败，状态码: ${response.status}, 错误信息: ${errorText}`,
    );
};

const getGenericImageSize = (config: ImageConfig, modelName: string) => {
    const normalizedAspectRatio = ["9:16", "16:9"].includes(config.aspectRatio) ? config.aspectRatio : "1:1";
    if (modelName === "dall-e-3") {
        return normalizedAspectRatio === "16:9"
            ? "1792x1024"
            : normalizedAspectRatio === "9:16"
                ? "1024x1792"
                : "1024x1024";
    }
    // gpt-image- 特定尺寸，目前好像是一样的
    if(modelName.startsWith("gpt-image-2")){
        const gptImage2SizeMap: Record<string, Record<string, string>> = {
            "1:1": { "1k": "1024x1024", "2k": "2048x2048", "4k": "3840x3840" },
            "16:9": { "1k": "1536x1024", "2k": "2048x1152", "4k": "3840x2160" },
            "9:16": { "1k": "1024x1536", "2k": "1152x2048", "4k": "2160x3840" },
        };
        return gptImage2SizeMap[normalizedAspectRatio]?.[config.size.toLowerCase()] || gptImage2SizeMap["1:1"]["1k"];
    }
    
    // 其他模型通用尺寸
    // if(modelName.startsWith("gpt-image-") && modelName !== "gpt-image-2"){
    //     size = "1k";//某些gpt系列只有三个尺寸，通过quality参数设置质量
    // }
    const sizeMap: Record<string, Record<string, string>> = {
        "1:1": { "1k": "1024x1024", "2k": "2048x2048", "4k": "4096x4096" },
        "16:9": { "1k": "1536x1024", "2k": "2048x1152", "4k": "3840x2160" },
        "9:16": { "1k": "1024x1536", "2k": "1152x2048", "4k": "2160x3840" },
    };

    return sizeMap[normalizedAspectRatio]?.[config.size.toLowerCase()] || sizeMap["1:1"]["1k"];
};

const extractTaskId = (data: any): string | undefined => {
    return data.task_id
        || data.id
        || data.output?.task_id
        || data.data?.task_id
        || data.data?.id;
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (
    model: TextModel,
    think: boolean,
    thinkLevel: 0 | 1 | 2 | 3,
) => {
    const apiKey = getAuthorization("text");
    if (!apiKey) throw new Error("缺少文本 API Key");
    if(model.modelName.startsWith("deepseek-v")){
        // DeepSeek 思考强度仅支持 high / max（low、medium 会被映射为 high，xhigh 会被映射为 max）
        // thinkLevel: 0/1/2 → high, 3 → max
        const effortMap: Record<0 | 1 | 2 | 3, "high" | "max"> = {
        0: "high",
        1: "high",
        2: "high",
        3: "max",
        };
        const enableThinking = model.think && think && thinkLevel !== 0;
        const extraBody: Record<string, any> = {
        thinking: { type: enableThinking ? "enabled" : "disabled" },
        };
        if (enableThinking) {
        extraBody.reasoning_effort = effortMap[thinkLevel];
        }
        logger(JSON.stringify(extraBody));
        return createDeepSeek({
        baseURL: getTextUrl(),
        apiKey,
        extraBody,
        }).chat(model.modelName);

    }else if (think && thinkLevel > 0) {
        // 模型名称变体，根据思考等级转换，1=low,2=medium, 3=high
        const think_lv = thinkLevel === 1 ? "low" : thinkLevel === 2 ? "medium" : "high";
        if (model.modelName.includes("gemini-3.1-pro-preview") || model.modelName.includes("gemini-3.1-flash-lite-preview")) {
            model.modelName = `${model.modelName}-thinking-${think_lv}`;
        }else if(model.modelName.startsWith("gpt-5") && model.modelName.includes("-codex")){
            model.modelName = `${model.modelName}-${think_lv}`;
        }else if(model.modelName.includes("claude-")){
            //暂不支持等级
            model.modelName = `${model.modelName}-thinking`;
        }
    }
    // 默认使用 openai 兼容接口
    return createOpenAI({
        baseURL: getTextUrl(),
        apiKey: apiKey.replace(/^Bearer\s+/, ""),
    }).chat(model.modelName);
};

const imageRequest = async (
    config: ImageConfig,
    model: ImageModel,
): Promise<string> => {
    // quality: dall-e-3 optional "standard" or "hd" or "low" or 3 more
    // "gpt-image-1"系列，quality 映射: 1K->low, 2K->medium, 4K->high
    const qualityMap: Record<string, string> = {
        "1k": "low",
        "2k": "medium",
        "4k": "high",
    };
    const imageRefs = (config.referenceList ?? []).map((r) => r.base64);
    const isEdit = imageRefs.length > 0;

    //模型映射，如果是gemini-3.1-flash-image-preview之类的模型，且 size 不是 1k，则拼接
    const supportedPrefixes = [
        "gemini-3.1-flash-image-preview",
        "gemini-3-pro-image-preview",
        "nano-banana-pro",
    ];
    const size = config.size.toLowerCase();
    if (supportedPrefixes.some((p) => model.modelName.startsWith(p)) && size !== "1k") {
        model.modelName = `${model.modelName}-${size}`;
    }
    let body: Record<string, any> = {};
    const url = getImageUrl(model.modelName, isEdit);

    if (url.endsWith("/chat/completions")) {
        // 可能要要加分辨率到提示词内
        if (isEdit) {
            // 图生图：使用数组格式包含图片
            const content: any[] = [{ type: "text", text: config.prompt + `，生成${config.aspectRatio}比例，分辨率：${config.size}` }];
            for (const img of imageRefs) {
                content.push({
                    type: "image_url",
                    image_url: {
                        url: img.startsWith("data:")
                            ? img
                            : `data:image/jpeg;base64,${img}`,
                    },
                });
            }
            body = {
                model: model.modelName,
                messages: [{ role: "user", content }],
            };
        } else {
            // 文生图：使用简单字符串格式
            body = {
                model: model.modelName,
                messages: [{ role: "user", content: config.prompt + `，生成${config.aspectRatio}比例，分辨率：${config.size}` }],
            };
        }
    } else if (url.endsWith("/v1/images/edits")) {
        // /v1/images/edits 格式
        body = {
            model: model.modelName,
            prompt: config.prompt,
            // response_format: "b64_json",//b64_json//url
            n: 1,
        };
        // 4o模型是异步的，需要考虑特殊处理
        // dall-e- 似乎不支持通过 images/edits 接口编辑图片，可以考虑去掉
        if(model.modelName.includes("dall-e-") || model.modelName.includes("gpt-image-")){
            body.size = getGenericImageSize(config, model.modelName);//转换为 1024x1024 格式分辨率
            body.quality = qualityMap[config.size] || "auto";//对应 1k,2k,4k质量
            // body.aspect_ratio = config.aspectRatio;//其他模型，直接赋值1:1,16:9,9:16
        }else{
            body.image_size = config.size;//其他模型，直接赋值1k,2k,4k
            body.aspect_ratio = config.aspectRatio;//其他模型，直接赋值1:1,16:9,9:16
        }

        if (isEdit) {
            const imageInput = imageRefs.length === 1 ? imageRefs[0] : imageRefs;
            body.image = imageInput;
        }


    } else if (url.includes(":generateContent")) {
        // Google Gemini 官方格式 /v1beta/models/{modelName}:generateContent
        const parts: any[] = [];
        // 可能要要加分辨率到提示词内
        // 添加图片（图生图）
        if (isEdit) {
            for (const img of imageRefs) {
                const base64Data = img.startsWith("data:") ? img.split(",")[1] : img;
                const mimeType = img.startsWith("data:") ? img.match(/data:(.*?);/)?.[1] || "image/png" : "image/png";
                parts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                });
            }
        }

        // 添加文本提示
        parts.push({ text: config.prompt });

        body = {
            contents: [{ role: "user", parts }],
            generationConfig: {
                imageConfig: {
                    aspectRatio: config.aspectRatio,
                    imageSize: config.size,
                },
                responseModalities: ["IMAGE"],
            },
        };
    } else {
        // /v1/images/generations 格式 (支持即梦模型)
        body = {
            model: model.modelName,
            prompt: config.prompt,
            aspect_ratio: config.aspectRatio,
            n: 1,
            response_format: "url",
        };

        // 图片分辨率处理
        if (model.modelName.includes("nano-banana-") || model.modelName.includes("gemini-3.1-") || model.modelName.includes("gemini-3-pro-image")) {
            body.image_size = config.size;
        } else if (model.modelName.startsWith("doubao-seedream-")) {
            // doubao-seedream-5-0 仅支持 2k、3k；4-5 仅支持 2k、4k
            const sizeKey = config.size.toLowerCase();
            const sizeMap: Record<string, string> = model.modelName.startsWith("doubao-seedream-5-0")
                ? { "1k": "2k", "2k": "2k", "4k": "3k" }
                : { "1k": "2k", "2k": "2k", "3k": "4k", "4k": "4k" };
            body.size = sizeMap[sizeKey] || config.size;
        } else {
            // 其他模型使用 1024x1024 格式的尺寸，包括flex-系列模型，gpt-image-2 /gpt-image-1.5 等
            body.size = getGenericImageSize(config, model.modelName); //转为 1024x1024 格式分辨率
            body.quality = qualityMap[config.size] || "auto";//对应 1k,2k,4k质量
            logger(`[imageRequest] ${model.modelName} 图片分辨率: ${body.size}`);
        }
        // 即梦模型特有参数
        if (model.modelName.includes("doubao-seedream") || model.modelName.includes("seedream")) {
            body.sequential_image_generation = "auto";
            body.stream = false;
            body.watermark = false;//关闭水印
        }
        if (isEdit) {
            body.image = imageRefs;
        }
    }
    logger(`[imageRequest] 提交通用图片生成任务，模型: ${model.modelName}，URL: ${url}`);
    let response;
    try {
        response = await axios.post(url, body, {
            headers: {
                Authorization: getAuthorization("image"),
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        const status = error.response?.status ?? "未知";
        const errorText = error.response?.data 
            ? (typeof error.response.data === "string" ? error.response.data : JSON.stringify(error.response.data))
            : `HTTP ${status}`;
        throw new Error(`${model.modelName} 图像生成请求失败，状态码: ${status}, 错误信息: ${errorText}`);
    }
    // axios 已自动解析 JSON，数据在 response.data 中
    const data = response.data;
    // 从响应中提取图片数据
    if (url.includes(":generateContent")) {
        // Gemini 返回格式: candidates[0].content.parts[].inline_data.data
        const candidates = data?.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error(`${model.modelName} 响应中没有 candidates`);
        }
        
        const firstCandidate = candidates[0];
        if (!firstCandidate?.content?.parts) {
            throw new Error(`${model.modelName} 响应格式无效，缺少 content.parts`);
        }
        
        // 查找包含图片的 part
        for (const part of firstCandidate.content.parts) {
            const inlineData = part.inline_data || part.inlineData;
            if (inlineData?.data) {
                const mimeType = inlineData.mime_type || inlineData.mimeType || "image/png";
                return `data:${mimeType};base64,${inlineData.data}`;
            }
        }
        
        // 如果循环结束未找到图片，抛出明确错误
        throw new Error(`${model.modelName} 响应中未找到图片数据`);
    }
    // 非 Gemini 接口的处理
    const result = extractResult(data);

    if (!result) {
        throw new Error(`${model.modelName} 图片生成成功但未返回可用结果`);
    }

    // 如果结果是 URL，转换为 base64
    if (result.startsWith("http://") || result.startsWith("https://")) {
        return await urlToBase64(result);
    }

    return result;
};

const videoRequest = async (
    config: VideoConfig,
    model: VideoModel,
): Promise<string> => {
    const apiKey = getApiKey("video");
    if (!apiKey) throw new Error("缺少视频 API Key");

    const imageRefs = (config.referenceList ?? []).filter((r) => r.type === "image").map((r) => r.base64);
    const videoRefs = (config.referenceList ?? []).filter((r) => r.type === "video").map((r) => r.base64);
    const audioRefs = (config.referenceList ?? []).filter((r) => r.type === "audio").map((r) => r.base64);

    const lowerName = model.modelName.toLowerCase();

    // 判断是否为 Seedance 模型
    const isSeedance = lowerName.includes("seedance") || lowerName.includes("doubao-seedance");
    // 判断是否为可灵模型
    const isKling = lowerName.includes("kling");
    // 判断是否为 Vidu 模型
    const isVidu = lowerName.includes("vidu");

    if (isSeedance) {
        // Seedance 模型使用专用接口
        return await seedanceVideoRequest(config, model, imageRefs, videoRefs, audioRefs);
    } else if (isKling) {
        // 可灵模型接口
        return await klingVideoRequest(config, model, imageRefs, videoRefs, audioRefs);
    } else if (isVidu) {
        // Vidu 模型使用专用接口
        return await viduVideoRequest(config, model, imageRefs, videoRefs, audioRefs);
    } else {
        // 通用视频接口（veo、wan、grok 等）
        return await genericVideoRequest(config, model, imageRefs, videoRefs, audioRefs);
    }
};

// =========视频接口格式=============

// Seedance 视频生成请求
const seedanceVideoRequest = async (
    config: VideoConfig,
    model: VideoModel,
    imageRefs: string[],
    videoRefs: string[],
    audioRefs: string[],
): Promise<string> => {
    // 构建 content 数组
    const content: any[] = [];
    const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;
    const isStartEndMode = activeMode === "startEndRequired" || activeMode === "endFrameOptional";
    const isMultiReferenceMode = Array.isArray(config.mode);
    // 添加文本提示词
    if (config.prompt) {
        content.push({
            type: "text",
            text: config.prompt,
        });
    }

    // 判断是否为 1.5 模型（仅支持首尾帧）
    const isSeedance15 = model.modelName.includes("seedance-1-5") || model.modelName.includes("seedance_1-5");

    // 添加图片参考
    for (const img of imageRefs) {
        const item: any = {
            type: "image_url",
            image_url: {
                url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`,
            },
        };
        // 1.5 模型使用 first_frame/last_frame，2.0 模型使用 reference_image
        if (isStartEndMode) {
            item.role = imageRefs.indexOf(img) === 0 ? "first_frame" : "last_frame";
        } else if (isMultiReferenceMode) {
            item.role = "reference_image";
        }
        content.push(item);
    }

    // 添加视频参考
    for (const video of videoRefs) {
        content.push({
            type: "video_url",
            video_url: {
                url: video.startsWith("data:") ? video : `data:video/mp4;base64,${video}`,
            },
            role: "reference_video",
        });
    }

    // 添加音频参考
    for (const audio of audioRefs) {
        content.push({
            type: "audio_url",
            audio_url: {
                url: audio.startsWith("data:") ? audio : `data:audio/mp3;base64,${audio}`,
            },
            role: "reference_audio",
        });
    }

    // 构建请求体
    const body: Record<string, any> = {
        model: model.modelName,
        content,
    };

    // 添加可选参数
    if (config.aspectRatio) {
        body.ratio = config.aspectRatio;
    }
    if (config.duration) {
        body.duration = config.duration;
    }
    if (typeof config.audio === "boolean" && config.audio === true) {
        body.generate_audio = config.audio;
    }
    // 添加 watermark 参数，默认关闭
    body.watermark = false;
    const response = await fetch(getSeedanceVideoCreateUrl(), {
        method: "POST",
        headers: {
            Authorization: getAuthorization("video"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorText: string;
        try {
            errorText = await response.text();
        } catch {
            errorText = `HTTP ${response.status}`;
        }
        throw new Error(`${model.modelName}视频生成请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }

    const data = await response.json();
    const taskId = extractTaskId(data);

    if (!taskId) {
        throw new Error(`${model.modelName}创建视频任务失败，未返回任务ID: ${JSON.stringify(data)}`);
    }

    // 轮询查询任务状态
    const pollResult = await pollTask(async () => {
        const queryResponse = await fetch(getSeedanceVideoQueryUrl(taskId), {
            method: "GET",
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
        });

        if (!queryResponse.ok) {
            const errorText = await queryResponse.text();
            throw new Error(`查询任务状态失败，状态码: ${queryResponse.status}, 错误信息: ${errorText}`);
        }

        const queryData = await queryResponse.json();
        const status = queryData?.status;

        switch (status) {
            case "succeeded":
            case "completed":
            case "SUCCESS":
            case "success":
                return { completed: true, data: queryData.content?.video_url };
            case "FAILED":
            case "failed":
            case "FAILURE":
                return { completed: true, error: queryData?.content?.fail_reason ?? queryData?.error?.message ?? "视频生成失败" };
            case "queued":
            case "processing":
            case "PENDING":
            case "RUNNING":
            default:
                return { completed: false};
        }
    });

    if (pollResult.error) {
        throw new Error(pollResult.error);
    }

    if (!pollResult.data) {
        logger(`[videoRequest] 视频生成完成但未返回视频URL，轮询结果: ${JSON.stringify(pollResult)}`);
        throw new Error("视频生成完成但未返回视频URL");
    }

    // 将视频URL转换为base64
    return await urlToBase64(pollResult.data);
};

// 通用视频生成请求（veo、wan、grok 等）
const genericVideoRequest = async (
    config: VideoConfig,
    model: VideoModel,
    imageRefs: string[],
    videoRefs: string[],
    audioRefs: string[],
): Promise<string> => {
    // 构建请求体
    const body: Record<string, any> = {
        model: model.modelName,
        prompt: config.prompt,
    };
    // 当前选择的视频生成模式
    const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;

    // 是否带音频生成
    if (typeof config.audio === "boolean") {
        if(model.modelName.startsWith("doubao-seedance")){
            body.generate_audio = config.audio;
        }else{
            body.audio = config.audio;
        }
    }

    // 画面比例参数
    if (config.aspectRatio) {
        if(model.modelName.startsWith("veo")){
            body.aspect_ratio = config.aspectRatio;
        }else{
            body.ratio = config.aspectRatio;
        }
    }
    if (config.duration) {
        body.duration = config.duration;
    }

    // 是否是全能参考模式 config.mode 是数组就代表是全能参考模式
    if (Array.isArray(config.mode)) {
        // 是数组就代表是全能参考模式
        if(audioRefs.length > 0 && model.modelName.startsWith("wan-")){
            // 万象 wan：audio_url 是字符串，参数优先级：audio_url > audio，仅在 audio_url为空时生效。使用方式参见音频设置。
            body.audio_url = audioRefs[0];
        }
    } else if (imageRefs.length > 0) {
        if (activeMode === "startEndRequired" || activeMode === "endFrameOptional" || activeMode === "startFrameOptional") {
            // 首尾帧/尾帧/首帧模式
            const first_frame = imageRefs[0];
            body.images = [first_frame];
            // 如果有 2 张图，则使用尾帧
            const last_frame = imageRefs[1] || '';
            if(last_frame) body.images.push(last_frame);
        }else{
            // 单图或者多图
            body.images = imageRefs.map((img) => img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`);
        }
    }

    // 水印开关：判断视频模型，是否添加watermark参数
    if (model.modelName.startsWith("wan-") || model.modelName.startsWith("doubao-")) {
        body.watermark = false;//关闭水印
        // if(model.modelName.startsWith("wan-")){
        //     // 指定是否启用提示重写。如果启用，则使用大型语言模型 （LLM） 智能重写输入提示。这显着改善了较短提示的生成结果，但增加了处理时间。
        //     body.prompt_extend = true;
        // }

        if(model.modelName.startsWith("wan-") && activeMode == "text"){
            // 万象文生视频 需要额外传 size 字段
            const wanSizeMap: Record<string, Record<string, string>> = {
            "480p": { "16:9": "832*480", "9:16": "480*832" },
            "720p": { "16:9": "1280*720", "9:16": "720*1280" },
            "1080p": { "16:9": "1920*1080", "9:16": "1080*1920" },
            };
            body.size = wanSizeMap[config.resolution]?.[config.aspectRatio];
        }

        if((model.modelName.startsWith("wan-") && activeMode != "text") || !model.modelName.startsWith("wan-")){
            // 排除 wan 文生视频，因为不支持resolution参数
            body.resolution = config.resolution;
        }
    }
    // veo 优化提示词开关：文生视频可超分
    if (model.modelName.startsWith("veo-")) {
        if (/[\u4e00-\u9fa5]/.test(config.prompt)) {
            // 判读提示词是否有中文
            // 是否优化提示词，一般是false；由于 veo 只支持英文提示词，所以如果需要中文自动转成英文提示词，可以开启此开关
            // body.enhance_prompt = true;
        }
        if(config.resolution === "1080p" && (imageRefs.length === 0 || activeMode == "text")){
            // veo 文生视频，可开启分辨率提升
            body.enable_upsample = true;//是否分辨率提升；返回 1080p 视频
        }
    }

    // wan 优化提示词开关
    if(model.modelName.startsWith("wan-")){
        //指定是否启用提示重写。如果启用，则使用大型语言模型 （LLM） 智能重写输入提示。这显着改善了较短提示的生成结果，但增加了处理时间。
        // body.prompt_extend = true;
    }

    const response = await fetch(getVideoCreateUrl(), {
        method: "POST",
        headers: {
            Authorization: getAuthorization("video"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${model.modelName}视频生成请求失败，状态码: ${response.status}, 错误信息: ${errorText}`);
    }

    const data = await response.json();
    const taskId = extractTaskId(data);

    if (!taskId) {
        throw new Error(`${model.modelName}创建视频任务失败，未返回任务ID: ${JSON.stringify(data)}`);
    }

    logger(`[videoRequest] ${model.modelName}视频任务创建成功，任务ID: ${taskId}`);

    // 轮询查询任务状态
    const pollResult = await pollTask(async () => {
        const queryResponse = await fetch(getVideoQueryUrl(taskId), {
            method: "GET",
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
        });

        if (!queryResponse.ok) {
            const errorText = await queryResponse.text();
            throw new Error(`${model.modelName}查询任务状态失败，状态码: ${queryResponse.status}, 错误信息: ${errorText}`);
        }

        const queryData = await queryResponse.json();
        const status = queryData?.status ?? queryData?.data?.status;
        // logger(`[videoRequest] ${model.modelName}视频查询任务状态，任务ID: ${taskId}, 状态: ${status}, 详情: ${JSON.stringify(queryData)}`);

        switch (status) {
            case "succeeded":
            case "completed":
            case "SUCCESS":
            case "success":
                return { completed: true, data: extractResult(queryData) };
            case "FAILURE":
            case "failed":
            case "FAILED":
                return { completed: true, error: queryData?.fail_reason ?? queryData?.data?.fail_reason ?? queryData?.error?.message ?? "视频生成失败" };
            case "queued":
            case "processing":
            case "PENDING":
            case "RUNNING":
            default:
                return { completed: false };
        }
    });

    if (pollResult.error) {
        throw new Error(pollResult.error);
    }

    if (!pollResult.data) {
        logger(`[videoRequest] ${model.modelName}视频生成完成但未返回视频URL，轮询结果: ${JSON.stringify(pollResult)}`);
        throw new Error("视频生成完成但未返回视频URL");
    }

    // 将视频URL转换为base64
    return await urlToBase64(pollResult.data);
};

// 可灵视频生成请求（Omni-Video）
const klingVideoRequest = async (
    config: VideoConfig,
    model: VideoModel,
    imageRefs: string[],
    videoRefs: string[],
    audioRefs: string[],
): Promise<string> => {
    // 构建请求体
    const body: Record<string, any> = {
        model_name: model.modelName,//可灵是model_name参数，● 枚举值：kling-video-o1, kling-v3-omni
        prompt: config.prompt,
        duration: config.duration,
        aspect_ratio: config.aspectRatio,
    };

    if (typeof config.audio === "boolean") {
        body.sound = config.audio ? "on" : "off";
    }

    body.mode = "std";
    if(config.resolution == "1080p"){
        // 生成视频的模式
        // ● 枚举值：std，pro
        // ● 其中std：标准模式（标准），基础模式，性价比高
        // ● 其中pro：专家模式（高品质），高表现模式，生成视频质量更佳
        // 不同模型版本、视频模式支持范围不同，详见当前文档3-0能力地图
        body.mode = "pro";
    }

    const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;
    const isStartEndMode = activeMode === "startEndRequired" || activeMode === "endFrameOptional";
    const isMultiReferenceMode = Array.isArray(config.mode);
    // 多款模型判断 - Omni-Video 系列模型
    const omniVideoModels = ["-omni", "kling-video-o1"];
    const isOmniVideo = omniVideoModels.some(omniModel => model.modelName.includes(omniModel));

    // 视频创建 url 和查询 url
    let klingVideoCreateUrl = getKlingOmniVideoCreateUrl();
    let klingVideoQueryUrl: (taskId: string) => string = getKlingOmniVideoQueryUrl;
    if(isOmniVideo){
        // 最高优先级，根据模型判断是否走OmniVideo接口，支持activeMode全部 mode 模式
       klingVideoCreateUrl = getKlingOmniVideoCreateUrl();
       klingVideoQueryUrl = getKlingOmniVideoQueryUrl;
    }else if(activeMode == "text"){
        klingVideoCreateUrl = getKlingText2videoCreateUrl();
        klingVideoQueryUrl = getKlingText2videoQueryUrl;
    }else if(isStartEndMode && imageRefs.length <= 2){
        // 首尾帧模式，不支持仅尾帧模式
        klingVideoCreateUrl = getKlingImg2videoCreateUrl();
        klingVideoQueryUrl = getKlingImg2videoQueryUrl;
    }else if(isMultiReferenceMode && !isOmniVideo && imageRefs.length > 0){
        // 多图参考，但不是 Omni-Video 模型
        klingVideoCreateUrl = getKlingMultiImage2videoCreateUrl();
        klingVideoQueryUrl = getKlingMultiImage2videoQueryUrl;
    }else if(imageRefs.length > 0){
        // 多图参考生成视频，走MultiImage2video
        klingVideoCreateUrl = getKlingMultiImage2videoCreateUrl();
        klingVideoQueryUrl = getKlingMultiImage2videoQueryUrl;
    }

    // 参考图片处理逻辑
    if (imageRefs.length > 0) {
        if(klingVideoCreateUrl.includes("videos/omni-video")){
            // 处理参考资源
            // ● 参考图片数量与参考主体数量和参考主体类型有关，其中：
            //     ○ 无参考视频+仅有多图主体时，参考图片与多图主体数量之和不得超过7；
            //     ○ 无参考视频+有视频主体时，参考图片与多图主体数量之和不得超过4；
            //     ○ 有参考视频+仅有多图主体时，参考图片与多图主体数量之和不得超过4；
            // ● 使用kling-video-o1模型时，数组中超过2张图片时，不支持设置首尾帧模式。
            body.image_list = imageRefs.map((img, index) => {
                // 可灵 API 要求：base64 图片数据不要添加 data:image/png;base64, 前缀
                // 只需要传递纯 base64 编码字符串
                const item: any = {
                    image_url: extractPureBase64(img),
                };
                // 首尾帧模式，不支持仅尾帧模式
                if(isStartEndMode){
                    // 只有首帧和尾帧配置 type，其他参考图片不配置
                    if (index === 0) {
                        item.type = "first_frame";
                    } else if (imageRefs.length === 2) {
                        // 有尾帧时必须有首帧（index 0 已配置）
                        item.type = "end_frame";
                    }
                }
                return item;
            });
        }else if(klingVideoCreateUrl.includes("videos/image2video")){
            // 图生视频，则首尾帧模式
            body.image = extractPureBase64(imageRefs[0]);
            if(imageRefs.length > 1){
                body.image_tail = extractPureBase64(imageRefs[1] || '');
            }
        }else if(klingVideoCreateUrl.includes("videos/multi-image2video")){
            // 多图参考生视频
            body.image_list = imageRefs.map((img) => ({
                image: extractPureBase64(img),
            }));
        }
    }

    // 参考视频处理逻辑
    if (isOmniVideo && videoRefs.length > 0) {
        // ● 可作为特征参考视频，也可作为待编辑视频，默认为待编辑视频；可选择性保留视频原声
        //     ○ 通过refer_type参数区分参考视频类型：feature为特征参考视频，base为待编辑视频
        //     ○ 参考视频为待编辑视频时，不能定义视频首尾帧
        //     ○ 通过keep_original_sound参数选择是否保留视频原声，yes为保留，no为不保留；当前参数对特征参考视频（feature）也生效
        // 有参考视频时，sound参数值只能为off
        body.sound = "off";
        // ● 视频格式仅支持MP4/MOV
        // ● 视频时长不少于3秒，上限与模型版本有关，详见能力地图
        // ● 视频宽高尺寸需介于720px（含）和2160px（含）之间
        // ● 视频帧率基于24fps～60fps，生成视频时会输出为24fps
        // ● 至多仅支持上传1段视频，视频大小不超过200MB
        // ● video_url参数值不得为空
        body.video_list = videoRefs.map((video) => ({
            video_url: video,
            refer_type: "feature", // feature为特征参考视频，base为待编辑视频
        }));
    }
    // 关闭水印
    body.watermark_info = {
        enabled: false // true 为生成，false 为不生成
    }

    // 使用 axios 发送请求，内置超时控制
    let data: any;
    try {
        const response = await axios.post(klingVideoCreateUrl, body, {
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
            timeout: 120000, // 120秒超时
        });
        data = response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
                throw new Error(`${model.modelName}视频生成请求超时（120秒），请稍后重试`);
            }
            throw new Error(`${model.modelName}视频生成请求失败: ${error.message}，请检查网络连接或稍后重试`);
        }
        throw error;
    }

    const taskId = extractTaskId(data);

    if (!taskId) {
        throw new Error(`创建视频任务失败，未返回任务ID: ${JSON.stringify(data)}`);
    }

    logger(`[videoRequest] 视频任务创建成功，任务ID: ${taskId}`);

    // 轮询查询任务状态
    const pollResult = await pollTask(async () => {
        const queryResponse = await fetch(klingVideoQueryUrl(taskId), {
            method: "GET",
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
        });

        if (!queryResponse.ok) {
            const errorText = await queryResponse.text();
            throw new Error(`查询任务状态失败，状态码: ${queryResponse.status}, 错误信息: ${errorText}`);
        }

        const queryData = await queryResponse.json();
        const data = queryData?.data;
        const status = data?.task_status ?? queryData?.status ?? queryData?.data?.status;

        switch (status) {
            case "succeed":
            case "succeeded":
            case "completed":
            case "SUCCESS":
            case "success":
                // 可灵返回的视频URL在 task_result.videos[0].url
                const videoUrl = data?.task_result?.videos?.[0]?.url;
                return { completed: true, data: videoUrl ?? extractResult(queryData) };
            case "failed":
            case "FAILED":
            case "FAILURE":
                return { completed: true, error: data?.task_status_msg ?? queryData?.fail_reason ?? queryData?.data?.fail_reason ?? queryData?.error?.message ?? "视频生成失败" };
            case "submitted":
            case "processing":
            case "queued":
            case "PENDING":
            case "RUNNING":
            default:
                return { completed: false };
        }
    });

    if (pollResult.error) {
        throw new Error(pollResult.error);
    }

    if (!pollResult.data) {
        throw new Error("视频生成成功但未返回视频URL");
    }

    // 将视频URL转换为base64
    return await urlToBase64(pollResult.data);
};

// Vidu 视频生成请求
const viduVideoRequest = async (
    config: VideoConfig,
    model: VideoModel,
    imageRefs: string[],
    videoRefs: string[],
    audioRefs: string[],
): Promise<string> => {
    // 构建请求体
    const body: Record<string, any> = {
        model: model.modelName,
        prompt: config.prompt,
        duration: config.duration,
        aspect_ratio: config.aspectRatio,
    };
    // 当前选择的视频生成模式
    const activeMode = Array.isArray(config.mode) ? config.mode[0] : config.mode;
    const isStartEnd = activeMode === "startEndRequired" || activeMode === "endFrameOptional" || activeMode === "startFrameOptional";
    const isReference = Array.isArray(config.mode);//全能参考模式
    
    // 模式选择接口：1张图用 img2video，首尾帧用 start-end2video，全能参考用 reference2video
    let createUrl: string;
    if (isReference) {
        createUrl = getViduReference2videoCreateUrl();
    } else if (isStartEnd) {
        createUrl = getViduStartEnd2videoCreateUrl();
    } else if (activeMode == "text"){
        createUrl = getViduText2videoCreateUrl();
    } else if(activeMode == "singleImage" || imageRefs.length == 1){
        // - viduq3-turbo：支持智能切镜，支持音画同出，生成速度最快，性价比最高
        // - viduq3：支持智能切镜，支持音画同出，多机位的一致性更出色
        // - viduq2-pro：支持参考视频，支持视频编辑，视频替换
        // - viduq2：动态效果好，生成细节丰富
        // - viduq1：画面清晰，平滑转场，运镜稳定
        // - vidu2.0：生成速度快
        createUrl = getViduImg2videoCreateUrl();
    }else{
        // 默认使用参考生视频
        createUrl = getViduReference2videoCreateUrl();
    }

    if (config.resolution) {
        body.resolution = config.resolution;
    }
    
    if (typeof config.audio === "boolean") {
        //* - VideoModel 的 audio 字段：true（始终生成音频）、false（不生成）、"optional"（用户可选）。
        body.audio = config.audio;//该参数为true时，voice_id参数才生效
        if(body.audio){
            body.audio_type = "all";//- all：音效+人声 - speech_only：仅人声 - sound_effect_only：仅音效
            if(isReference || imageRefs.length == 1 || activeMode == "singleImage"){
             //单图和参考模式可用
             // body.voice_id = "";//用来决定视频中的声音音色，为空时系统会自动推荐，可选枚举值参考列表：新音色列表
            }
        }
        // body.bgm = true;//是否开启背景音乐
    }
    const use_subjects = false;//未实现主体参考
    if(use_subjects && createUrl.includes("reference2video")){
        // Vidu reference2video 使用 主体subjects和非主体 格式，未完善

        // 主体调用，将图片分组为 subjects，每个 subject 包含 name 和 images 数组
        // const subjects_name = "subjects_";
        // body.subjects = [
        //     {
        //         name: subjects_name,//主体id，后续生成时可以通过@主体id的方式使用
        //         images: imageRefs.map((img) => img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`),
        //         voice_id: ""//用来决定视频中的声音音色，为空时系统会自动推荐，可选枚举值参考列表：新音色列表
        //     }
        // ];
    }else if (imageRefs.length > 0) {
        // 参考生视频非主体格式和其他图生视频模式

        // ============ 参考生视频 ============
        // 图像参考支持上传1～7张图片，模型将以此参数中传入的图片中的主题为参考生成具备主体一致的视频。
        // 注1：：viduq3-mix、viduq3-turbo、viduq3、 viduq2、viduq1、vidu2.0模型支持上传1～7张图片
        // 注2：使用viduq2-pro模型时，如果不上传视频，则支持上传1-7张图，如果上传视频则支持1-4张图
        // 注3：支持传入图片 Base64 编码或图片URL（确保可访问）
        // 注4：图片支持 png、jpeg、jpg、webp格式
        // 注5：图片像素不能小于 128*128，且比例需要小于1:4或者4:1，且大小不超过50M。
        // 注6：请注意，http请求的post body不超过20MB，且编码必须包含适当的内容类型字符串，例如：data:image/png;base64,\{base64_encode\}

        body.images = imageRefs.map((img) => img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`);
    }

    if(videoRefs.length > 0){
        // ============ 视频参考 ============
        // 视频参考支持上传1～2个视频，模型将以此参数中传入的视频作为参考，生成具备主体一致的视频。
        // 注1： 仅viduq2-pro模型支持该参数
        // 注2：使用视频参考功能时，最多支持上传 1个8秒 视频 或 2个5秒 视频
        // 注3：视频支持 mp4、avi、mov格式
        // 注4：视频像素不能小于 128*128，且比例需要小于1:4或者4:1，且大小不超过100M。
        // 注5：请注意，base64 decode之后的字节长度需要小于20M，且编码必须包含适当的内容类型字符串，例如：data:video/mp4;base64,\{base64_encode\}
        body.videos = videoRefs.map((video) => video.startsWith("data:") ? video : `data:video/mp4;base64,${video}`);
    }

    body.watermark = false;//关闭水印

    // 使用 axios 发送请求，内置超时控制
    let data: any;
    try {
        const response = await axios.post(createUrl, body, {
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
            timeout: 120000, // 120秒超时
        });
        data = response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
                throw new Error(`${model.modelName}视频生成请求超时（120秒），请稍后重试`);
            }
            throw new Error(`${model.modelName}视频生成请求失败: ${error.message}，请检查网络连接或稍后重试`);
        }
        throw error;
    }

    const taskId = extractTaskId(data);

    if (!taskId) {
        throw new Error(`${model.modelName}创建视频任务失败，未返回任务ID: ${JSON.stringify(data)}`);
    }

    logger(`[videoRequest] ${model.modelName}视频任务创建成功，任务ID: ${taskId}`);

    // 轮询查询任务状态
    const pollResult = await pollTask(async () => {
        const queryResponse = await fetch(getViduVideoQueryUrl(taskId), {
            method: "GET",
            headers: {
                Authorization: getAuthorization("video"),
                "Content-Type": "application/json",
            },
        });

        if (!queryResponse.ok) {
            const errorText = await queryResponse.text();
            throw new Error(`查询任务状态失败，状态码: ${queryResponse.status}, 错误信息: ${errorText}`);
        }

        const queryData = await queryResponse.json();
        // Vidu 返回示例中 state 表示状态
        const status = queryData?.state ?? queryData?.status ?? queryData?.data?.status;

        switch (status) {
            case "success":
            case "completed":
            case "SUCCESS":
                return { completed: true, data: extractResult(queryData) };
            case "failed":
            case "FAILED":
            case "FAILURE":
                return { completed: true, error: queryData?.payload ?? queryData?.error?.message ?? "视频生成失败" };
            case "created":
            case "processing":
            case "queued":
            case "PENDING":
            case "RUNNING":
            default:
                return { completed: false };
        }
    });

    if (pollResult.error) {
        throw new Error(`${model.modelName}视频生成失败: ${pollResult.error}`);
    }

    if (!pollResult.data) {
        throw new Error(`${model.modelName}视频生成成功但未返回视频URL`);
    }

    // 将视频URL转换为base64
    return await urlToBase64(pollResult.data);
};

const ttsRequest = async (
    config: TTSConfig,
    model: TTSModel,
): Promise<string> => {
    throw new Error(`暂不支持音频模型: ${model.modelName}`);
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
    const remoteVendorUrl = `https://tf.4022543.xyz/store/bltcy/${vendor.id}.ts`;
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

// 这行代码用于确保当前文件被识别为模块，避免全局变量冲突
export { };
