<div style="background: linear-gradient(90deg, #1e3c72, #2a5298); padding: 20px; border-radius: 8px; color: white; text-align: center; margin-bottom: 20px;">
  <h1 style="margin: 0; font-family: Arial, sans-serif;">GAINTHREAD - MPC Game Generator</h1>
  <p style="margin: 5px 0 0; font-size: 1.2em;">A Construct 3 Addon for AI-Powered Game Creation</p>
</div>

---

**[Generate game elements and prototypes in Construct 3 using natural language prompts powered by AI.]**

The **MPC Game Generator** addon brings AI-driven creativity to Construct 3. Describe your ideas in plain text, and this addon will generate JavaScript code, game objects, or sprite images for your project. Perfect for rapid prototyping, experimentation, or adding unique content to your games—all without leaving the Construct 3 environment.

- **Version**: 1.0.0  
- **Author**: [Joshua J. Gomes]  
- **License**: [Apache License 2.0](LICENSE)  
- **Repository**: [github.com/joshfisidi/gainthread](https://github.com/joshfisidi/gainthread)

---

## Features

- **Code Generation**: Turn prompts like "Create a player movement script" into usable JavaScript code.
- **Object Generation**: Prototype game objects (e.g., "A bouncing enemy that shoots bullets") with ease.
- **Sprite Generation**: Create visual assets like "A futuristic spaceship" as images.
- **Service-Based**: Connects to an external AI API for generation (API key required).
- **Model Options**: Choose between `mpc-code`, `mpc-game`, or `mpc-sprite` generation modes.

---

## Installation

1. **Download the Addon**  
   - Get `gainthread.c3addon` from the [Releases](https://github.com/joshfisidi/gainthread/releases) page.

2. **Install in Construct 3**  
   - Open Construct 3.
   - Navigate to `Menu > Addons > Install New Addon`.
   - Drag and drop `gainthread.c3addon` or browse to select it.
   - Confirm installation.

3. **Add to Your Project**  
   - In your project, right-click the `Project Bar` > `Add new object type`.
   - Select `MPC Game Generator` under the `General` category.

---

## Configuration

### Plugin Setup
- Add the `MPC Game Generator` object to your project (single-global plugin).
- Configure in the `Properties` panel:
  - **API Key**: Your API key for the AI service (required—see "API Setup").
  - **Model**: Select the generation mode:
    - `mpc-code`: JavaScript code generation.
    - `mpc-game`: Game object prototyping.
    - `mpc-sprite`: Sprite image creation.
  - **System Prompt**: Default instruction (e.g., "You are an AI assistant that helps create Construct 3 games.").

### API Setup
- Requires an external AI service (e.g., custom Anthrophic, OpenAI, Grok API etc.).
- Obtain an API key from your provider and enter it in the `API Key` field.
- Edit `c3runtime/domSide.js`:
  - Update `DOMAIN` to your API’s base URL (default: `https://api.example.com`).
  - Adjust endpoints if needed (`/generate/code`, `/generate/object`, `/generate/sprite`).

---

## Usage

### Actions
| Action                | Description                                  | Example Prompt                       |
|-----------------------|----------------------------------------------|--------------------------------------|
| `Generate Code`       | Generates JavaScript code from a prompt.     | "Create a score system"             |
| `Generate Game Object`| Prototypes a game object from a description. | "A bouncing enemy that shoots"      |
| `Generate Sprite`     | Creates a sprite image from a prompt.        | "A futuristic spaceship"            |
| `Cancel Generation`   | Stops the current generation process.        | N/A                                 |

### Conditions
| Condition             | Description                                  |
|-----------------------|----------------------------------------------|
| `Is Generating`       | True if currently processing a prompt.       |
| `On Generation Complete` | Triggers when generation succeeds.        |
| `On Generation Error` | Triggers if generation fails.              |

### Expressions
| Expression  | Returns                                      |
|-------------|----------------------------------------------|
| `GetResult` | Last generated content (code, JSON, image data). |
| `GetError`  | Last error message if generation failed.     |

### Example Event Sheet
```plaintext
+ On start of layout
  -> MPC Game Generator: Generate code with prompt "Add a score system"
+ MPC Game Generator: On generation complete
  -> System: Execute JavaScript (MPC Game Generator.GetResult)
+ MPC Game Generator: On generation error
  -> Debug: Log (MPC Game Generator.GetError)
