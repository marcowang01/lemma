# Math Helper

A web application that provides step-by-step solutions to mathematical problems through text or image input.

![Math Helper Interface](/assets/screenshot.png)

## Quick Start

1. Get required API keys:
   - Anthropic API key from https://www.anthropic.com/api
   - Wolfram App ID from https://developer.wolframalpha.com/access

2. Set up environment variables:
   ```bash
   ANTHROPIC_API_KEY=your_key_here
   WOLFRAM_APP_ID=your_id_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:3005`

5. Build for production:
   ```bash
   npm run build
   ```

## Features

### Version Toggle
Switch between v1.0 and v2.0 using the toggle in the top right corner:
- V1.0: Better reasoning capability and improved latency
- V2.0: Interactive UI elements and chart generation capabilities

### Current Features
- Text input for math questions
- Image input support (upload photos of math problems)
- Generation of interactive UI elements (v2.0)
- LaTeX rendering for mathematical expressions

### How to Use
1. Submit your math question through:
   - Text input
   - Image upload
2. Receive a detailed step-by-step solution
3. View generated UI elements (v2.0) or formatted mathematical expressions

## Roadmap

Future development plans include:
- Follow-up questions capability
- PDF and multiple file upload support
- Enhanced observability and monitoring
- Multi-step reasoning for UI generation
- Templates and additional constraints for UI generation
- Add authentication, sessions, and persist solutions

## Requirements
- Node.js (version 16 or higher)
- npm (Node Package Manager)
- Anthropic API key
- Wolfram App ID
