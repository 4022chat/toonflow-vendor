/**
 * OOPC AI v2 供应商适配文件
 * @version 2.0.0
 */

export default {
  id: "oopc",
  label: "OOPC API",
  version: "2.0.0",
  readme: `# OOPC API

gpt-image-2.5-sunburst 最低只需¥0.04/张！

支持 OpenAI 兼容、Gemini 原生图像生成。

正在内测中，加微信 jxppro 获取apikey！
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
        placeholder: "请输入 OOPC API Key"
      }
    }
  ],

  models: [
    {
      id: "gpt-image-2.5-flare",
      label: "GPT Image 2.5 Flare",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
    },
    {
      id: "gpt-image-2.5-sunburst",
      label: "GPT Image 2.5 Sunburst",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
    },
    {
      id: "gpt-image-2",
      label: "GPT Image 2",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "9:21"]
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
      id: "gemini-3.1-flash-image",
      label: "Gemini 3.1 Flash Image",
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
      id: "gemini-3.1-flash-image-preview",
      label: "Gemini 3.1 Flash Image Preview",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["1K", "2K", "4K"],
      imageRatios: ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3", "3:4"]
    }
  ],

  async generateImage(request) {
    this.signal?.throwIfAborted();

    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw new Error("请填写 API Key");
    }

    const actualModel = request.model;
    const baseUrl = "https://api.oopc.top/v1";

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

    // 根据模型类型选择不同的接口
    if (actualModel.startsWith("gemini-")) {
      return this.generateGeminiImage(request, actualModel, apiKey, baseUrl);
    } else {
      return this.generateOpenAIImage(request, actualModel, apiKey, baseUrl);
    }
  },

  async generateOpenAIImage(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(360000),
      ...(this.signal ? [this.signal] : [])
    ]);

    const images = request.images || [];
    const hasImages = images.length > 0;

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
    // size 支持 1K/2K/4K 档位（按比例查表），或直接使用像素尺寸
    const size = /^\d+x\d+$/.test(sizeInput) ? sizeInput : (sizeMap[sizeInput]?.[ratio] || "1024x1024");

    // 画质档位：优先使用请求中的 quality（low/medium/high），否则由尺寸档位映射
    const qualityParam = request.quality || (sizeInput === "1K" ? "low" : sizeInput === "2K" ? "medium" : "high");

    // gpt-image 系列模型：仅 1K 档使用原模型，其他档位需映射为 -pro 后缀模型
    const requestModel = actualModel.startsWith("gpt-image-") && sizeInput !== "1K"
      ? `${actualModel}-pro`
      : actualModel;

    // 如果有参考图，使用 /edits 接口（multipart）
    if (hasImages) {
      const boundary = "----ToonflowBoundary" + Date.now();
      const parts = [];

      // 添加 model
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${requestModel}\r\n`
      ));

      // 添加 prompt
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="prompt"\r\n\r\n${request.prompt}\r\n`
      ));

      // 添加 size
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\n${size}\r\n`
      ));

      // 添加 quality（1K/2K/4K 档位映射为 low/medium/high）
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="quality"\r\n\r\n${qualityParam}\r\n`
      ));

      // 添加 n
      parts.push(new TextEncoder().encode(
        `--${boundary}\r\nContent-Disposition: form-data; name="n"\r\n\r\n1\r\n`
      ));

      // 添加图片文件
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let imageBytes;
        let mimeType = img.mimeType || "image/png";

        if (img.type === "url") {
          const resp = await this.tool.fetch(img.url, { signal });
          imageBytes = new Uint8Array(await resp.arrayBuffer());
        } else if (img.type === "base64") {
          imageBytes = new Uint8Array(Buffer.from(img.data, "base64"));
        } else {
          imageBytes = img.data;
        }

        const ext = mimeType.split('/')[1] || 'png';
        parts.push(new TextEncoder().encode(
          `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="image${i}.${ext}"\r\nContent-Type: ${mimeType}\r\n\r\n`
        ));
        parts.push(imageBytes);
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

      const response = await this.tool.fetch(`${baseUrl}/images/edits`, {
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
        throw new Error(`图片编辑失败：${error}`);
      }

      const result = await response.json();
      signal.throwIfAborted();

      const imageData = result?.data?.[0];
      if (!imageData) {
        throw new Error("图片编辑成功但未返回可用结果");
      }

      // 处理返回结果
      if (imageData.b64_json) {
        const base64Data = imageData.b64_json.startsWith("data:") 
          ? imageData.b64_json.split(",")[1] 
          : imageData.b64_json;
        return [{
          mediaType: "image",
          type: "base64",
          data: base64Data,
          mimeType: "image/png"
        }];
      } else if (imageData.url) {
        return [{
          mediaType: "image",
          type: "url",
          url: imageData.url
        }];
      }

      throw new Error("图片编辑成功但未返回可用结果");
    }

    // 无参考图，使用 /generations 接口
    const body = {
      model: requestModel,
      prompt: request.prompt,
      size: size,
      n: 1,
      quality: qualityParam
    };

    const response = await this.tool.fetch(`${baseUrl}/images/generations`, {
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

    const imageData = result?.data?.[0];
    if (!imageData) {
      throw new Error("图片生成成功但未返回可用结果");
    }

    // 处理返回结果
    if (imageData.b64_json) {
      const base64Data = imageData.b64_json.startsWith("data:") 
        ? imageData.b64_json.split(",")[1] 
        : imageData.b64_json;
      return [{
        mediaType: "image",
        type: "base64",
        data: base64Data,
        mimeType: "image/png"
      }];
    } else if (imageData.url) {
      return [{
        mediaType: "image",
        type: "url",
        url: imageData.url
      }];
    }

    throw new Error("图片生成成功但未返回可用结果");
  },

  async generateGeminiImage(request, actualModel, apiKey, baseUrl) {
    const signal = AbortSignal.any([
      AbortSignal.timeout(360000),
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
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    }

    // 计算 imageSize
    const size = request.size || "2K";
    const ratio = request.ratio || "1:1";

    const body = {
      contents: [{
        role: "user",
        parts: requestParts
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: ratio,
          imageSize: size
        }
      }
    };

    const apiOrigin = baseUrl.replace(/\/v1$/, "");
    const response = await this.tool.fetch(
      `${apiOrigin}/v1beta/models/${actualModel}:generateContent`,
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
      const inlineData = part.inlineData || part.inline_data;
      if (inlineData?.data) {
        const mimeType = inlineData.mimeType || inlineData.mime_type || "image/png";
        return [{
          mediaType: "image",
          type: "base64",
          data: inlineData.data,
          mimeType
        }];
      }
    }

    throw new Error("未能从 Gemini 响应中提取图片");
  }
};
