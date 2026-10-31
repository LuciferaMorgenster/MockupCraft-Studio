# MockupCraft Studio

**MockupCraft Studio** is an interactive product mockup application designed to visualize brand logos on realistic merchandise instantly, augmented with powerful AI image generation and editing capabilities.

---

## ✨ Features

### 🎨 Interactive Mockup Studio
- **Drag-and-Drop Logo Placement**: Directly click and drag your uploaded logo on the interactive canvas to position it with real-time feedback.
- **10 Realistic Product Templates**:
  - *Classic Ceramic Mug* (featuring realistic cylindrical curved wrap and specular lighting)
  - *Crewneck T-Shirt* (featuring authentic fabric folds and displacement mapping)
  - *Heavyweight Pullover Hoodie*
  - *Canvas Tote Bag*
  - *Enamel Camping Mug*
  - *Stainless Steel Tumbler*
  - *Classic Dad Cap*
  - *Hardcover Journal*
  - *Die-cut Laptop Sticker*
  - *Phone Case*
- **Fine-Tuning Controls**:
  - Precision scale, X/Y placement, rotation, and opacity adjustments.
  - Color inversion and print boundary guide toggles.
  - **Print Effects**: Original, White Ink, Black Ink, Shimmering Gold Foil, Thread Embroidery, and Vintage Washed Print.
- **Custom Product Colors**: Choose from curated color palettes or select exact shades using a custom HEX color picker.
- **Merchandise Collection Showcase**: Instant multi-product grid rendering your logo across all available products at once.
- **Retina Export**: Export high-resolution PNG/JPEG mockups or copy directly to your clipboard.

---

### 🤖 AI Image Generation
- **High-Resolution Mockup Generation**: Produce commercial-grade product renders with resolution selection:
  - **1K** ($1024 \times 1024$)
  - **2K** ($2048 \times 2048$)
  - **4K** ($4096 \times 4096$)
- **Aspect Ratio Options**: Support for `1:1`, `4:3`, `3:4`, `16:9`, and `9:16`.
- **Photoshoot Inspiration Presets**: Quick-start templates for studio lighting, lifestyle scenes, and commercial backgrounds.
- **Logo Integration Toggle**: Seamlessly embed your active logo directly into AI-generated scenes.

---

### 🪄 AI Image Editing & Enhancement
- **Natural Language Canvas Editing**: Modify your mockup scenes using simple text prompts (e.g., *“add rising steam”*, *“apply realistic warm café lighting”*, *“add vintage fabric washes”*, or *“change background to a marble countertop”*).
- **Before/After Comparison View**: Interactive slider/side-by-side view to compare your AI edits directly against the original canvas render.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mockupcraft-studio.git
   cd mockupcraft-studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys (e.g., for AI services):
   ```env
   VITE_AI_API_KEY=your_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

- **Frontend Framework**: React / TypeScript
- **Styling**: Tailwind CSS
- **Canvas / Graphics Rendering**: HTML5 Canvas / WebGL
- **Icons**: Lucide React

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
