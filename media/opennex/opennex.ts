/**
 * OpenNex API v2 供应商适配文件
 * @version 2.0.0
 */

export default {
  id: "opennex",
  label: "OpenNex API",
  version: "2.0.0",
  readme: `# OpenNex API

4022升级版，支持 Seedance 2.5、GPT-Image 2.5、Gemini、ChatGPT、Claude 等多种模型。

OpenNex API 中转站，支持所有的模型接入，一个 key 搞定所有。

源头供货，稳定价低。邀请好友可返点。[点这里去注册](https://api.opennex.top/register?aff=gYGC)

如遇 bug 请联系微信：jxppro
`,

  rules: [
    {
      type: "input",
      field: "apiKey",
      title: "API 密钥",
      value: "",
      props: {
        type: "password",
        showPassword: true,
        autocomplete: "off",
        placeholder: "到 api.opennex.top 注册并复制 key 填入"
      }
    }
  ],

  models: [
    // ========== 图片模型 ==========
    {
      id: "gpt-image-2.5-sunburst",
      label: "GPT-Image 2.5 Sunburst",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
    },
    {
      id: "gpt-image-2.5-flare",
      label: "GPT-Image 2.5 Flare",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
    },
    {
      id: "gpt-image-2",
      label: "GPT-Image 2",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
    },
    {
      id: "doubao-seedream-5-0-pro-260628",
      label: "豆包 Seedream 5.0 Pro",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]
    },
    {
      id: "doubao-seedream-5-0-260128",
      label: "豆包 Seedream 5.0",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]
    },
    {
      id: "doubao-seedream-4-5-251128",
      label: "豆包 Seedream 4.5",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]
    },
    {
      id: "gemini-3.1-flash-image-preview",
      label: "Gemini 3.1 Flash Image Preview",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3", "3:4"]
    },
    {
      id: "gemini-3-pro-image-preview",
      label: "Gemini 3 Pro Image Preview",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3", "3:4"]
    },
    {
      id: "gemini-3.1-flash-image",
      label: "Gemini 3.1 Flash Image",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3", "3:4"]
    },
    {
      id: "gemini-3-pro-image",
      label: "Gemini 3 Pro Image",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3", "3:4"]
    },
    {
      id: "grok-imagine-image",
      label: "Grok Imagine Image",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["960x960", "1280x720", "720x1280"],
      imageRatios: ["1:1", "16:9", "9:16"]
    },

    // ========== 视频模型 ==========
    {
      id: "wan3.0-video",
      label: "WAN 3.0 Video (阿里万象3)",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      durationResolutionMap: [
        { duration: [4, 5, 8, 10, 15, 20, 25, 30], resolution: ["480p", "720p", "1080p"] }
      ]
    },
    {
      id: "doubao-seedance-2-5-260628",
      label: "Seedance 2.5",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      durationResolutionMap: [
        { duration: [4, 5, 8, 10, 15, 20, 25, 30], resolution: ["720p", "1080p"] }
      ]
    },
    {
      id: "doubao-seedance-2-0-260128",
      label: "Seedance 2.0",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      durationResolutionMap: [
        { duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p"] }
      ]
    },
    {
      id: "doubao-seedance-2-0-fast-260128",
      label: "Seedance 2.0 Fast",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired", "endFrameOptional", ["imageReference:9", "videoReference:3", "audioReference:3"]],
      durationResolutionMap: [
        { duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p"] }
      ]
    },
  ],

  async generateImage(request) {
    this.signal?.throwIfAborted();

    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw new Error("请填写 API Key");
    }

    const actualModel = request.model;
    const baseUrl = "https://api.opennex.top";

    // 校验不支持的字段
    if (request.mask) {
      throw new Error("当前模型不支持蒙版输入");
    }
    if (request.outputFormat) {
      throw new Error("当前不支持指定输出格式");
    }
    if (request.n !== undefined && request.n !== 1) {
      throw new Error("当前仅支持一次生成 1 张图片");
    }
    if (request.other && Object.keys(request.other).length > 0) {
      throw new Error(`不支持的额外参数：${Object.keys(request.other).join("、")}`);
    }

    // 处理参考图片
    const images = request.images || [];
    const hasImages = images.length > 0;

    // 根据模型类型选择不同的接口
    if (actualModel.startsWith("doubao-seedream-")) {
      return this.generateDoubaoImage(request, actualModel, apiKey, baseUrl);
    } else if (actualModel.startsWith("gemini-")) {
      return this.generateGeminiImage(request, actualModel, apiKey, baseUrl);
    } else {
      return this.generateOpenAIImage(request, actualModel, apiKey, baseUrl, hasImages);
    }
  },

  async generateOpenAIImage(request, actualModel, apiKey, baseUrl, hasImages) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(120000),
      ...(this.signal ? [this.signal] : [])
    ]);

    // 处理参考图
    const imageInputs = [];
    if (request.images) {
      for (const img of request.images) {
        if (img.type === "url") {
          const resp = await this.tool.fetch(img.url, { signal });
          const bytes = new Uint8Array(await resp.arrayBuffer());
          imageInputs.push({ data: bytes, mimeType: img.mimeType || "image/jpeg" });
        } else if (img.type === "base64") {
          const bytes = new Uint8Array(Buffer.from(img.data, "base64"));
          imageInputs.push({ data: bytes, mimeType: img.mimeType });
        } else {
          imageInputs.push({ data: img.data, mimeType: img.mimeType });
        }
      }
    }

    // 计算图片尺寸 - 根据 quality 和 ratio 计算实际 size
    // 尺寸严格限制规则：
    // 1. 图片最大边长 ≤ 3840px
    // 2. 宽高两边像素均为 16px 的倍数
    // 3. 长边 / 短边 比值 ≤ 3:1
    // 4. 总像素范围：最小 655360 ~ 最大 8294400
    // 超过 2560x1440 的分辨率属实验性能力
    const sizeMap = {
      "1K": {
        "1:1": "1024x1024",     // 1:1 正方形
        "16:9": "1536x1024",    // 1.5:1 横版
        "9:16": "1024x1536",    // 1:1.5 竖版
        "4:3": "1152x864",      // 1.33:1 横版
        "3:4": "864x1152",      // 1:1.33 竖版
        "3:2": "1248x832",      // 1.5:1 横版
        "2:3": "832x1248",      // 1:1.5 竖版
        "21:9": "1632x704",     // 2.32:1 超宽横版
        "9:21": "704x1632"      // 1:2.32 超高竖版
      },
      "2K": {
        "1:1": "2048x2048",     // 1:1 正方形
        "16:9": "2048x1152",    // 1.78:1 横版
        "9:16": "1152x2048",    // 1:1.78 竖版
        "4:3": "2304x1728",     // 1.33:1 横版
        "3:4": "1728x2304",     // 1:1.33 竖版
        "3:2": "2496x1664",     // 1.5:1 横版
        "2:3": "1664x2496",     // 1:1.5 竖版
        "21:9": "3264x1408",    // 2.32:1 超宽横版
        "9:21": "1408x3264"     // 1:2.32 超高竖版
      },
      "4K": {
        "1:1": "3840x3840",     // 1:1 正方形（实验性）
        "16:9": "3840x2160",    // 1.78:1 横版
        "9:16": "2160x3840",    // 1:1.78 竖版
        "4:3": "3328x2496",     // 1.33:1 横版（实验性）
        "3:4": "2496x3328",     // 1:1.33 竖版（实验性）
        "3:2": "3712x2480",     // 1.5:1 横版（实验性）
        "2:3": "2480x3712",     // 1:1.5 竖版（实验性）
        "21:9": "3840x1648",    // 2.32:1 超宽横版
        "9:21": "1648x3840"     // 1:2.32 超高竖版
      }
    };

    const sizeInput = request.size || "1K";
    const ratio = request.ratio || "1:1";
    // size 支持 1K/2K/4K 档位（按比例查表），或直接使用像素尺寸（如 grok-imagine-image）
    const size = /^\d+x\d+$/.test(sizeInput) ? sizeInput : (sizeMap[sizeInput]?.[ratio] || "1024x1024");

    // 画质档位：优先使用请求中的 quality（low/medium/high），否则由尺寸档位映射
    let qualityParam;
    if (request.quality) {
      qualityParam = request.quality;
    } else if (["1K", "2K", "4K"].includes(sizeInput)) {
      qualityParam = sizeInput === "1K" ? "low" : sizeInput === "2K" ? "medium" : "high";
    }

    // 如果有参考图，使用 /edits 接口（multipart）
    if (hasImages && imageInputs.length > 0) {
      const boundary = "----ToonflowBoundary" + Date.now();
      const parts = [];

      // 添加 model
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${actualModel}\r\n`
      ));

      // 添加 prompt
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="prompt"\r\n\r\n${request.prompt}\r\n`
      ));

      // 添加 size
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\n${size}\r\n`
      ));

      // 添加 quality（1K/2K/4K 档位映射为 low/medium/high，像素尺寸且未指定画质时不传）
      if (qualityParam) {
        parts.push(new TextEncoder().encode(
          `--${boundary}\r\nContent-Disposition: form-data; name="quality"\r\n\r\n${qualityParam}\r\n`
        ));
      }

      // 添加 n
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="n"\r\n\r\n1\r\n`
      ));

      // 添加图片文件
      for (let i = 0; i < imageInputs.length; i++) {
        const img = imageInputs[i];
        const ext = img.mimeType.split('/')[1] || 'jpg';
        parts.push(new TextEncoder().encode(
          `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="image${i}.${ext}"\r\nContent-Type: ${img.mimeType}\r\n\r\n`
        ));
        parts.push(img.data);
        parts.push(new TextEncoder().encode("\r\n"));
      }

      parts.push(new TextEncoder().encode(`--${boundary}--\r\n`));

      // 合并所有部分
      const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
      const body = new Uint8Array(totalLength);
      let offset = 0;
      for (const part of parts) {
        body.set(part, offset);
        offset += part.length;
      }

      const response = await this.tool.fetch(`${baseUrl}/v1/images/edits`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`
        },
        body,
        signal
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`图片生成失败：${error}`);
      }

      const result = await response.json();
      signal.throwIfAborted();

      const url = result?.data?.[0]?.url || result?.data?.[0]?.b64_json;
      if (!url) {
        throw new Error("图片生成成功但未返回可用结果");
      }

      if (url.startsWith("http")) {
        return [{ mediaType: "image", type: "url", url }];
      }
      const base64Data = url.startsWith("data:") ? url.split(",")[1] : url;
      return [{ mediaType: "image", type: "base64", data: base64Data, mimeType: "image/png" }];
    }

    // 无参考图，使用 /generations 接口
    const body = {
      model: actualModel,
      prompt: request.prompt,
      size: size,
      n: 1
    };

    if (qualityParam) {
      body.quality = qualityParam;
    }

    const response = await this.tool.fetch(`${baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`图片生成失败：${error}`);
    }

    const result = await response.json();
    signal.throwIfAborted();

    const url = result?.data?.[0]?.url || result?.data?.[0]?.b64_json;
    if (!url) {
      throw new Error("图片生成成功但未返回可用结果");
    }

    if (url.startsWith("http")) {
      return [{ mediaType: "image", type: "url", url }];
    }
    const base64Data = url.startsWith("data:") ? url.split(",")[1] : url;
    return [{ mediaType: "image", type: "base64", data: base64Data, mimeType: "image/png" }];
  },

  async generateDoubaoImage(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(120000),
      ...(this.signal ? [this.signal] : [])
    ]);

    // 处理参考图
    const imageBase64List = [];
    if (request.images) {
      for (const img of request.images) {
        let base64Data;
        if (img.type === "url") {
          const resp = await this.tool.fetch(img.url, { signal });
          const bytes = new Uint8Array(await resp.arrayBuffer());
          base64Data = Buffer.from(bytes).toString("base64");
        } else if (img.type === "base64") {
          base64Data = img.data;
        } else {
          base64Data = Buffer.from(img.data).toString("base64");
        }
        const mimeType = img.mimeType || "image/png";
        imageBase64List.push(`data:${mimeType};base64,${base64Data}`);
      }
    }

    // 计算尺寸 - 根据 quality 和 ratio 计算实际 size
    // 豆包 Seedream 限制规则：
    // 1. 宽高比取值范围：[1/16, 16]
    // 2. 总像素取值范围：[2560x1440=3686400, 4096x4096=16777216]
    // 支持分辨率方式（2K/4K）或直接指定像素值（宽x高）
    const sizeMap = {
      "2K": {
        "1:1": "2048x2048",     // 1:1 正方形
        "16:9": "2730x1536",    // 16:9 横版
        "9:16": "1536x2730",    // 9:16 竖版
        "4:3": "2560x1920",     // 4:3 横版
        "3:4": "1920x2560",     // 3:4 竖版
        "3:2": "2800x1866",     // 3:2 横版
        "2:3": "1866x2800"      // 2:3 竖版
      },
      "4K": {
        "1:1": "4096x4096",     // 1:1 正方形
        "16:9": "4096x2304",    // 16:9 横版
        "9:16": "2304x4096",    // 9:16 竖版
        "4:3": "4096x3072",     // 4:3 横版
        "3:4": "3072x4096",     // 3:4 竖版
        "3:2": "4096x2730",     // 3:2 横版
        "2:3": "2730x4096"      // 2:3 竖版
      }
    };

    const sizeInput = request.size || "2K";
    const ratio = request.ratio || "1:1";
    // size 支持 2K/4K 档位（按比例查表），或直接使用像素尺寸
    const size = /^\d+x\d+$/.test(sizeInput) ? sizeInput : (sizeMap[sizeInput]?.[ratio] || "2048x2048");

    const body = {
      model: actualModel,
      prompt: request.prompt,
      size,
      watermark: false,
      output_format: "png",
      response_format: "url"
    };

    if (imageBase64List.length === 1) {
      body.image = imageBase64List[0];
    } else if (imageBase64List.length > 1) {
      body.image = imageBase64List;
      body.sequential_image_generation = "disabled";
    }

    const response = await this.tool.fetch(`${baseUrl}/api/v3/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`豆包图片生成失败：${error}`);
    }

    const result = await response.json();
    signal.throwIfAborted();

    const url = result?.data?.[0]?.url || result?.data?.[0]?.b64_json;
    if (!url) {
      throw new Error("豆包图片生成成功但未返回可用结果");
    }

    if (url.startsWith("http")) {
      return [{ mediaType: "image", type: "url", url }];
    }
    const base64Data = url.startsWith("data:") ? url.split(",")[1] : url;
    return [{ mediaType: "image", type: "base64", data: base64Data, mimeType: "image/png" }];
  },

  async generateGeminiImage(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(120000),
      ...(this.signal ? [this.signal] : [])
    ]);

    const requestParts = [{ text: request.prompt }];

    // 添加参考图
    if (request.images) {
      for (const img of request.images) {
        let base64Data;
        let mimeType = img.mimeType || "image/png";

        if (img.type === "url") {
          const resp = await this.tool.fetch(img.url, { signal });
          const bytes = new Uint8Array(await resp.arrayBuffer());
          base64Data = Buffer.from(bytes).toString("base64");
        } else if (img.type === "base64") {
          base64Data = img.data;
        } else {
          base64Data = Buffer.from(img.data).toString("base64");
        }

        requestParts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        });
      }
    }

    const body = {
      contents: [{
        role: "user",
        parts: requestParts
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: request.ratio || "1:1",
          imageSize: request.size || "2K"
        }
      }
    };

    const response = await this.tool.fetch(
      `${baseUrl}/v1beta/models/${actualModel}:generateContent`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        signal
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini 图片生成失败：${error}`);
    }

    const result = await response.json();
    signal.throwIfAborted();

    const candidates = result?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Gemini 响应中没有 candidates");
    }

    const responseParts = candidates[0]?.content?.parts;
    if (!responseParts || responseParts.length === 0) {
      throw new Error("Gemini 响应中没有 parts");
    }

    for (const part of responseParts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        const mimeType = inlineData.mime_type || inlineData.mimeType || "image/png";
        return [{
          mediaType: "image",
          type: "base64",
          data: inlineData.data,
          mimeType
        }];
      }
    }

    throw new Error("未能从 Gemini 响应中提取图片");
  },

  async generateVideo(request) {
    this.signal?.throwIfAborted();

    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw new Error("请填写 API Key");
    }

    const actualModel = request.model;
    const baseUrl = "https://api.opennex.top";

    // 校验不支持的字段
    if (request.other && Object.keys(request.other).length > 0) {
      throw new Error(`不支持的额外参数：${Object.keys(request.other).join("、")}`);
    }

    // 根据模型类型分发到不同处理函数
    if (actualModel.startsWith("wan3.0") || actualModel.startsWith("wan-")) {
      return this.generateWanVideo(request, actualModel, apiKey, baseUrl);
    } else if (actualModel.startsWith("doubao-seedance-")) {
      return this.generateDoubaoVideo(request, actualModel, apiKey, baseUrl);
    }

    throw new Error(`不支持的视频模型：${actualModel}`);
  },

  async generateWanVideo(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(600000),
      ...(this.signal ? [this.signal] : [])
    ]);

    // 处理参考素材
    const media = [];
    const videos = request.videos || [];
    const audios = request.audios || [];

    // 首尾帧：优先使用独立字段；未提供时回退按 images 顺序识别（第 1 张为首帧，第 2 张为尾帧）
    const isFrameMode = request.mode === "startEndRequired" || request.mode === "endFrameOptional" || request.mode === "startFrameOptional";
    let firstFrame = request.firstFrame;
    let lastFrame = request.lastFrame;
    let refImages = request.images || [];
    if (!firstFrame && !lastFrame && isFrameMode && refImages.length > 0) {
      firstFrame = refImages[0];
      lastFrame = refImages.length > 1 ? refImages[1] : undefined;
      refImages = lastFrame ? refImages.slice(2) : refImages.slice(1);
    }

    if (firstFrame) {
      media.push({ type: "first_frame", url: await this.mediaToDataUrl(firstFrame, "image/jpeg", signal) });
    }
    if (lastFrame) {
      media.push({ type: "last_frame", url: await this.mediaToDataUrl(lastFrame, "image/jpeg", signal) });
    }

    // 转换参考图为 base64
    for (const img of refImages) {
      media.push({ type: "reference_image", url: await this.mediaToDataUrl(img, "image/jpeg", signal) });
    }

    // 处理视频
    for (const video of videos) {
      media.push({ type: "reference_video", url: await this.mediaToDataUrl(video, "video/mp4", signal) });
    }

    // 处理音频
    for (const audio of audios) {
      media.push({ type: "reference_audio", url: await this.mediaToDataUrl(audio, "audio/mp3", signal) });
    }

    const body = {
      model: actualModel,
      input: {
        prompt: request.prompt
      },
      parameters: {
        resolution: request.resolution === "1080p" ? "1080P" : request.resolution === "720p" ? "720P" : "480P",
        ratio: request.ratio || "16:9",
        duration: request.duration || 5
      }
    };

    if (media.length > 0) {
      body.input.media = media;
    }

    if (request.generateAudio) {
      body.parameters.audio_setting = "auto";
    }

    // 提交任务
    const createResponse = await this.tool.fetch(`${baseUrl}/alibailian/api/v1/services/aigc/video-generation/video-synthesis`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
      },
      body: JSON.stringify(body),
      signal
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`WAN 视频任务创建失败：${error}`);
    }

    const createData = await createResponse.json();
    const taskId = createData?.output?.task_id;
    if (!taskId) {
      throw new Error(`WAN 视频任务创建失败: ${JSON.stringify(createData)}`);
    }

    // 轮询任务状态
    let attempts = 0;
    const maxAttempts = 120;

    while (attempts < maxAttempts) {
      this.signal?.throwIfAborted();

      await new Promise(resolve => {
        const timer = setTimeout(resolve, 5000);
        if (this.signal) {
          this.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
        }
      });

      const queryResponse = await this.tool.fetch(
        `${baseUrl}/alibailian/api/v1/tasks/${taskId}`,
        {
          headers: { "Authorization": `Bearer ${apiKey}` },
          signal
        }
      );

      if (!queryResponse.ok) {
        throw new Error(`WAN 视频查询失败：${await queryResponse.text()}`);
      }

      const queryData = await queryResponse.json();
      const status = String(queryData?.output?.task_status || "").toUpperCase();

      if (status === "SUCCEEDED") {
        const videoUrl = queryData?.output?.video_url;
        if (!videoUrl) {
          throw new Error("WAN 视频任务完成，但未返回视频 URL");
        }

        // 下载视频
        const videoResp = await this.tool.fetch(videoUrl, { signal });
        const videoBytes = new Uint8Array(await videoResp.arrayBuffer());
        return [{
          mediaType: "video",
          type: "binary",
          data: videoBytes,
          mimeType: "video/mp4"
        }];
      } else if (status === "FAILED") {
        throw new Error(queryData?.output?.message || "WAN 视频生成失败");
      }

      attempts++;
    }

    throw new Error("WAN 视频生成超时");
  },

  /**
   * 将图片 Buffer 上传到中转图床，返回公开访问 URL。
   * 接口：POST https://imageproxy.zhongzhuan.chat/api/upload (multipart/form-data, field: file)
   * 响应：{ url: "https://imageproxy.zhongzhuan.chat/api/proxy/image/<hash>", created: ... }
   * 失败自动重试，最多 3 次；成功返回 URL，全部失败抛出错误。
   */
  async uploadImageToProxy(imageBuffer, mimeType, tag) {
    const UPLOAD_URL = "https://imageproxy.zhongzhuan.chat/api/upload";
    const extMap = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const ext = extMap[mimeType] || "jpg";
    const filename = `ref_${Date.now()}.${ext}`;
    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const signal = AbortSignal.any([
          AbortSignal.timeout(60000),
          ...(this.signal ? [this.signal] : [])
        ]);

        const boundary = "imgproxy_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
        const headerLine = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
        const footerLine = `\r\n--${boundary}--\r\n`;
        const body = Buffer.concat([
          Buffer.from(headerLine, "utf-8"),
          imageBuffer,
          Buffer.from(footerLine, "utf-8"),
        ]);

        const res = await this.tool.fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
          body,
          signal,
        });

        const raw = await res.text();

        if (!res.ok) {
          if (attempt < MAX_ATTEMPTS) continue;
          throw new Error(`HTTP ${res.status}：${raw.slice(0, 200)}`);
        }

        const data = JSON.parse(raw);
        const url = data?.url || null;
        if (url) {
          return url;
        }

        if (attempt < MAX_ATTEMPTS) continue;
        throw new Error(`响应无 url 字段：${raw.slice(0, 200)}`);
      } catch (err) {
        // 用户主动取消时不重试
        if (this.signal?.aborted) {
          throw err;
        }
        if (attempt >= MAX_ATTEMPTS) {
          throw new Error(`参考图上传图床失败（${tag}）：${err?.message || String(err)}`);
        }
      }
    }

    throw new Error(`参考图上传图床失败（${tag}）`);
  },

  /**
   * 将 MediaInput 转为 data URL（base64 内联），供直接提交给接口。
   */
  async mediaToDataUrl(media, defaultMime, signal) {
    if (media.type === "url") {
      const resp = await this.tool.fetch(media.url, { signal });
      if (!resp.ok) {
        throw new Error(`下载参考素材失败（HTTP ${resp.status}）：${media.url}`);
      }
      const bytes = new Uint8Array(await resp.arrayBuffer());
      return `data:${media.mimeType || defaultMime};base64,${Buffer.from(bytes).toString("base64")}`;
    }
    if (media.type === "base64") {
      return media.data.startsWith("data:") ? media.data : `data:${media.mimeType || defaultMime};base64,${media.data}`;
    }
    return `data:${media.mimeType || defaultMime};base64,${Buffer.from(media.data).toString("base64")}`;
  },

  /**
   * 将图片 MediaInput 转为二进制并上传到中转图床，返回公开访问 URL。
   */
  async mediaInputToProxyUrl(media, tag, signal) {
    const mimeType = media.mimeType || "image/jpeg";
    let imageBuffer;
    if (media.type === "url") {
      const resp = await this.tool.fetch(media.url, { signal });
      if (!resp.ok) {
        throw new Error(`下载参考图失败（HTTP ${resp.status}）：${media.url}`);
      }
      imageBuffer = Buffer.from(await resp.arrayBuffer());
    } else if (media.type === "base64") {
      imageBuffer = Buffer.from(media.data, "base64");
    } else {
      imageBuffer = Buffer.from(media.data);
    }
    return await this.uploadImageToProxy(imageBuffer, mimeType, tag);
  },

  async generateDoubaoVideo(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(600000),
      ...(this.signal ? [this.signal] : [])
    ]);

    const content = [{ type: "text", text: request.prompt }];

    // 首尾帧：优先使用独立字段；未提供时回退按 images 顺序识别（第 1 张为首帧，第 2 张为尾帧）
    const isFrameMode = request.mode === "startEndRequired" || request.mode === "endFrameOptional" || request.mode === "startFrameOptional";
    const frameInputs = [];
    if (request.firstFrame) {
      frameInputs.push({ media: request.firstFrame, role: "first_frame" });
    }
    if (request.lastFrame) {
      frameInputs.push({ media: request.lastFrame, role: "last_frame" });
    }
    let refImages = request.images || [];
    if (frameInputs.length === 0 && isFrameMode && refImages.length > 0) {
      frameInputs.push({ media: refImages[0], role: "first_frame" });
      if (refImages.length > 1) {
        frameInputs.push({ media: refImages[1], role: "last_frame" });
      }
      refImages = refImages.slice(frameInputs.length);
    }

    // 处理首尾帧：统一上传到中转图床，拿到公开 URL 后再提交给视频接口
    for (let i = 0; i < frameInputs.length; i++) {
      const imageUrl = await this.mediaInputToProxyUrl(frameInputs[i].media, `frame_${i}`, signal);
      content.push({
        type: "image_url",
        image_url: { url: imageUrl },
        role: frameInputs[i].role
      });
    }

    // 处理参考图：单图（无首尾帧）不带 role，多图时标记为 reference_image
    for (let i = 0; i < refImages.length; i++) {
      const imageUrl = await this.mediaInputToProxyUrl(refImages[i], `image_${i}`, signal);
      if (frameInputs.length === 0 && refImages.length === 1) {
        content.push({
          type: "image_url",
          image_url: { url: imageUrl }
        });
      } else {
        content.push({
          type: "image_url",
          image_url: { url: imageUrl },
          role: "reference_image"
        });
      }
    }

    // 处理视频
    const videos = request.videos || [];
    for (const video of videos) {
      let videoUrl;
      if (video.type === "url") {
        videoUrl = video.url;
      } else {
        let base64Data = video.type === "base64" ? video.data : Buffer.from(video.data).toString("base64");
        videoUrl = `data:${video.mimeType};base64,${base64Data}`;
      }
      content.push({
        type: "video_url",
        video_url: { url: videoUrl },
        role: "reference_video"
      });
    }

    // 处理音频
    const audios = request.audios || [];
    for (const audio of audios) {
      let audioUrl;
      if (audio.type === "url") {
        audioUrl = audio.url;
      } else {
        let base64Data = audio.type === "base64" ? audio.data : Buffer.from(audio.data).toString("base64");
        audioUrl = `data:${audio.mimeType};base64,${base64Data}`;
      }
      content.push({
        type: "audio_url",
        audio_url: { url: audioUrl },
        role: "reference_audio"
      });
    }

    const body = {
      model: actualModel,
      content,
      ratio: request.ratio || "16:9",
      duration: request.duration || 5,
      watermark: false
    };

    if (request.resolution) {
      body.resolution = request.resolution;
    }

    if (request.generateAudio !== undefined) {
      body.generate_audio = request.generateAudio;
    }

    // 提交任务
    const createResponse = await this.tool.fetch(`${baseUrl}/api/v3/contents/generations/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`豆包视频任务创建失败：${error}`);
    }

    const createData = await createResponse.json();
    const taskId = createData?.data?.task_id || createData?.id || createData?.task_id;
    if (!taskId) {
      throw new Error(`豆包视频任务创建失败: ${JSON.stringify(createData)}`);
    }

    // 轮询
    let attempts = 0;
    const maxAttempts = 120;

    while (attempts < maxAttempts) {
      this.signal?.throwIfAborted();

      await new Promise(resolve => {
        const timer = setTimeout(resolve, 5000);
        if (this.signal) {
          this.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
        }
      });

      const queryResponse = await this.tool.fetch(
        `${baseUrl}/api/v3/contents/generations/tasks/${taskId}`,
        {
          headers: { "Authorization": `Bearer ${apiKey}` },
          signal
        }
      );

      if (!queryResponse.ok) {
        throw new Error(`豆包视频查询失败：${await queryResponse.text()}`);
      }

      const queryData = await queryResponse.json();
      const status = String(queryData?.status || "").toLowerCase();

      if (status === "succeeded") {
        const videoUrl = queryData?.content?.video_url;
        if (!videoUrl) {
          throw new Error("豆包视频任务完成，但未返回视频 URL");
        }

        // 下载视频
        const videoResp = await this.tool.fetch(videoUrl, { signal });
        const videoBytes = new Uint8Array(await videoResp.arrayBuffer());
        return [{
          mediaType: "video",
          type: "binary",
          data: videoBytes,
          mimeType: "video/mp4"
        }];
      } else if (["failed", "failure", "error"].includes(status)) {
        throw new Error(queryData?.fail_reason || "豆包视频生成失败");
      }

      attempts++;
    }

    throw new Error("豆包视频生成超时");
  }
};
