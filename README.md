# Lemma

A web app that provides step-by-step solutions to math problems through text or image input. This project is under active development.


![Math Helper Interface](/assets/homepage.png)

## Features


### Current Features
- Text input for math questions
- Image input support (upload photos of math problems)
- Generation of interactive UI elements
- LaTeX rendering for mathematical expressions
- Use reasoning models for complex problems
- Use wolfram alpha to verify computations

### How to Use
1. Submit your math question through:
   - Text input
   - Image upload
2. Receive a detailed step-by-step solution
3. View generated UI elements (v2.0) or formatted mathematical expressions


![Math Helper Interface](/assets/solution.png)


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
