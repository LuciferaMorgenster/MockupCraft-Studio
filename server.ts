import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous body limit for image payloads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to initialize GoogleGenAI with required User-Agent
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please configure your API key in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Generate High-Quality Images using gemini-3-pro-image-preview (supports 1K, 2K, 4K)
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1', logoBase64 } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();

    const parts: any[] = [];
    if (logoBase64 && typeof logoBase64 === 'string' && logoBase64.includes('base64,')) {
      const cleanData = logoBase64.split('base64,')[1];
      const mimeMatch = logoBase64.match(/data:([^;]+);base64/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      parts.push({
        inlineData: {
          data: cleanData,
          mimeType: mime,
        },
      });
      parts.push({
        text: `Create a professional, photorealistic commercial product mockup featuring this provided logo. ${prompt}`,
      });
    } else {
      parts.push({
        text: prompt,
      });
    }

    // Call gemini-3-pro-image-preview with imageSize (1K, 2K, 4K)
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio as any,
          imageSize: chosenSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let textResponse = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: textResponse || 'The model completed without returning an image. Please refine your prompt.',
      });
    }

    return res.json({
      imageUrl,
      modelUsed: 'gemini-3-pro-image-preview',
      imageSize: chosenSize,
      aspectRatio: chosenRatio,
      caption: textResponse,
    });
  } catch (err: any) {
    console.error('Error generating image with gemini-3-pro-image-preview:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate high-quality image.',
    });
  }
});

// 2. Create or Edit Images using gemini-nano-banana-2.1
app.post('/api/edit-or-create-image', async (req: Request, res: Response) => {
  try {
    const { prompt, currentImageBase64, imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();
    const parts: any[] = [];

    if (currentImageBase64 && typeof currentImageBase64 === 'string') {
      const cleanData = currentImageBase64.includes('base64,')
        ? currentImageBase64.split('base64,')[1]
        : currentImageBase64;
      const mimeMatch = currentImageBase64.match(/data:([^;]+);base64/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';

      parts.push({
        inlineData: {
          data: cleanData,
          mimeType: mime,
        },
      });
      parts.push({
        text: `Edit the provided product mockup according to these instructions: ${prompt}. Maintain photorealistic lighting, product textures, and clean logo fidelity.`,
      });
    } else {
      parts.push({
        text: prompt,
      });
    }

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio as any,
          imageSize: chosenSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let textResponse = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: textResponse || 'The model completed without returning an image. Please refine your edit prompt.',
      });
    }

    return res.json({
      imageUrl,
      modelUsed: 'gemini-nano-banana-2.1',
      imageSize: chosenSize,
      aspectRatio: chosenRatio,
      caption: textResponse,
    });
  } catch (err: any) {
    console.error('Error with gemini-nano-banana-2.1:', err);
    return res.status(500).json({
      error: err.message || 'Failed to create/edit image with gemini-nano-banana-2.1.',
    });
  }
});

// 3. AI Mockup Ideas & Marketing Copy Generator
app.post('/api/suggest-mockups', async (req: Request, res: Response) => {
  try {
    const { brandName = 'My Brand', productCategory = 'Merchandise' } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate 4 creative product mockup scene descriptions and photoshoot concepts for a brand named "${brandName}" selling ${productCategory}. Include lighting, backdrop, and vibe ideas. Return as JSON array of objects with "title", "prompt", and "vibe" keys.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return res.json({ suggestions: JSON.parse(response.text || '[]') });
  } catch (err: any) {
    console.error('Error suggesting mockups:', err);
    return res.status(500).json({ error: err.message || 'Failed to suggest mockups.' });
  }
});

// Vite Middleware for Dev or Static Serving for Prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
