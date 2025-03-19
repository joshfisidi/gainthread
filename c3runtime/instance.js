"use strict";

/**
 * MPC Game Generator Runtime Instance
 * Handles runtime functionality for the MPC Game Generator plugin
 */
class MPC_GameGeneratorInstance {
  constructor(inst, properties) {
    this._inst = inst;
    
    // DOM side script handling
    this._inst.AddDOMMessageHandler("generation-complete", (data) => this._onGenerationComplete(data));
    this._inst.AddDOMMessageHandler("generation-error", (data) => this._onGenerationError(data));
    
    // Instance properties
    this._isGenerating = false;
    this._lastResult = "";
    this._lastError = "";
    this._lastMetadata = null;
    this._generationType = "";
    this._abortController = null;
    
    // Property values
    this._apiKey = properties[0];
    this._apiEndpoint = properties[1] || "https://api.example.com";
    this._model = properties[2];
    this._systemPrompt = properties[3];
    this._temperature = properties[4];
    this._maxTokens = properties[5];
    this._autoImplement = properties[6];
    
    // Add window close handler for cleanup
    this._boundHandlers = {
      windowClose: () => this._onWindowClose()
    };
    
    window.addEventListener("beforeunload", this._boundHandlers.windowClose);
  }
  
  Release() {
    // Remove event listeners
    window.removeEventListener("beforeunload", this._boundHandlers.windowClose);
    
    // Cancel any pending generations
    this._cancelGeneration();
  }
  
  SaveToJson() {
    return {
      // Save instance state to JSON
      // Don't save sensitive data like API keys
      "lastResult": this._lastResult,
      "lastMetadata": this._lastMetadata
    };
  }
  
  LoadFromJson(o) {
    // Load instance state from JSON
    this._lastResult = o["lastResult"] || "";
    this._lastMetadata = o["lastMetadata"] || null;
  }
  
  // Private methods
  _onWindowClose() {
    this._cancelGeneration();
  }
  
  _cancelGeneration() {
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }
    this._isGenerating = false;
  }
  
  async _makeGeneration(prompt, type) {
    if (this._isGenerating) {
      this._lastError = "Already generating content. Please wait or cancel the current generation.";
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationError);
      return;
    }
    
    // Update generation type
    this._generationType = type;
    
    // Clear previous results
    this._lastResult = "";
    this._lastError = "";
    this._lastMetadata = null;
    
    // Start generation
    this._isGenerating = true;
    this._abortController = new AbortController();
    
    // Trigger generation start
    this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationStart);
    
    // Send to DOM side
    try {
      const result = await this._inst.PostToDOMAsync("make-generation", {
        prompt,
        type,
        apiKey: this._apiKey,
        endpoint: this._apiEndpoint,
        model: this._model,
        systemPrompt: this._systemPrompt,
        temperature: this._temperature,
        maxTokens: this._maxTokens,
        autoImplement: this._autoImplement
      });
      
      this._lastResult = result;
      this._isGenerating = false;
      this._abortController = null;
      
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationComplete);
    } catch (error) {
      this._lastError = error.message || "Unknown error during generation";
      this._isGenerating = false;
      this._abortController = null;
      
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationError);
    }
  }
  
  _onGenerationComplete(data) {
    this._lastResult = data.result || "";
    this._lastMetadata = data.metadata || null;
    this._isGenerating = false;
    this._abortController = null;
    
    // Log success
    console.log(`MPC Generation complete (${this._generationType}): ${this._lastResult.substring(0, 100)}...`);
    
    // Trigger completion event
    this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationComplete);
    
    // Trigger type-specific completion events
    if (this._generationType === "code") {
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnCodeGenerationComplete);
    } else if (this._generationType === "object") {
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnObjectGenerationComplete);
    } else if (this._generationType === "sprite") {
      this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnSpriteGenerationComplete);
    }
  }
  
  _onGenerationError(data) {
    this._lastError = data.error || "Unknown error";
    this._isGenerating = false;
    this._abortController = null;
    
    // Log error
    console.error(`MPC Generation error (${this._generationType}): ${this._lastError}`);
    
    // Trigger error event
    this._inst.Trigger(C3.Plugins.MPC_GameGenerator.Cnds.OnGenerationError);
  }
  
  // Conditions
  IsGenerating() {
    return this._isGenerating;
  }
  
  OnGenerationStart() {
    return true;
  }
  
  OnGenerationComplete() {
    return true;
  }
  
  OnCodeGenerationComplete() {
    return this._generationType === "code";
  }
  
  OnObjectGenerationComplete() {
    return this._generationType === "object";
  }
  
  OnSpriteGenerationComplete() {
    return this._generationType === "sprite";
  }
  
  OnGenerationError() {
    return true;
  }
  
  // Actions
  GenerateCode(prompt) {
    this._makeGeneration(prompt, "code");
  }
  
  GenerateObject(prompt) {
    this._makeGeneration(prompt, "object");
  }
  
  GenerateSprite(prompt) {
    this._makeGeneration(prompt, "sprite");
  }
  
  GenerateGame(prompt) {
    // Special case: generating a complete game combines code and object generation
    this._makeGeneration(prompt, "game");
  }
  
  CancelGeneration() {
    this._cancelGeneration();
  }
  
  SetApiKey(key) {
    this._apiKey = key;
  }
  
  SetApiEndpoint(endpoint) {
    this._apiEndpoint = endpoint;
  }
  
  SetModel(model) {
    this._model = model;
  }
  
  SetSystemPrompt(prompt) {
    this._systemPrompt = prompt;
  }
  
  // Expressions
  GetResult() {
    return this._lastResult;
  }
  
  GetError() {
    return this._lastError;
  }
  
  GetMetadata(key) {
    if (!this._lastMetadata || typeof this._lastMetadata !== "object") {
      return "";
    }
    
    return this._lastMetadata[key] || "";
  }
  
  GetGenerationType() {
    return this._generationType;
  }
  
  // Debugging
  GetDebuggerProperties() {
    const prefix = "plugins.mpc_gamegenerator.debugger";
    return [{
      title: prefix + ".title",
      properties: [
        { name: prefix + ".is-generating", value: this._isGenerating },
        { name: prefix + ".generation-type", value: this._generationType },
        { name: prefix + ".last-result", value: this._lastResult },
        { name: prefix + ".last-error", value: this._lastError },
        { name: prefix + ".api-endpoint", value: this._apiEndpoint },
        { name: prefix + ".model", value: this._model }
      ]
    }];
  }
}

// Register the instance ctor with the runtime
C3.Plugins.MPC_GameGenerator.Instance = MPC_GameGeneratorInstance;
