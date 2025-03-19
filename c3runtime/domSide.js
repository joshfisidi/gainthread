"use strict";

// DOM-side script for making MPC API calls
{
  const DOM_COMPONENT_ID = "mpc-game-generator";
  
  class MPCGameGeneratorDOMHandler extends self.DOMHandler {
    constructor() {
      super();
      
      // Add handler for runtime messages
      this.AddRuntimeMessageHandler("make-generation", (data) => this._onMakeGeneration(data));
    }
    
    async _onMakeGeneration(data) {
      const { 
        prompt, 
        type, 
        apiKey, 
        model, 
        systemPrompt, 
        endpoint, 
        temperature, 
        maxTokens,
        autoImplement 
      } = data;
      
      try {
        if (!apiKey) {
          throw new Error("API key is required. Please configure it in the properties panel.");
        }
        
        if (!endpoint) {
          throw new Error("API endpoint is required. Please configure it in the properties panel.");
        }
        
        // Determine specific API endpoint based on generation type
        let apiPath = "";
        switch (type) {
          case "code":
            apiPath = "/generate/code";
            break;
          case "object":
            apiPath = "/generate/object";
            break;
          case "sprite":
            apiPath = "/generate/sprite";
            break;
          default:
            throw new Error(`Unknown generation type: ${type}`);
        }
        
        // Prepare request payload
        const payload = {
          prompt: prompt,
          model: model,
          system_prompt: systemPrompt,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 2048,
          auto_implement: autoImplement !== undefined ? autoImplement : true
        };
        
        // Add Construct 3 specific context for better generation
        if (type === "code" || type === "object") {
          payload.context = {
            platform: "construct3",
            construct_version: self.C3.Plugins.MPC_GameGenerator.getC3Version?.() || "3.0"
          };
        }
        
        // Call API
        console.log(`Making API request to ${endpoint}${apiPath}`, { type, model });
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
        
        const response = await fetch(`${endpoint}${apiPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }
          throw new Error(errorData.error || `API request failed: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        // Process result based on generation type
        let result = "";
        switch (type) {
          case "code":
            result = responseData.code || responseData.result || "";
            break;
          case "object":
            // For objects, return either a JSON string or implementation code
            result = responseData.implementation || JSON.stringify(responseData.object || responseData.result || {});
            break;
          case "sprite":
            // For sprites, we'd typically get back an image URL or base64 data
            result = responseData.imageUrl || responseData.base64Image || responseData.result || "";
            break;
        }
        
        // Add metadata to result if available
        const metadata = responseData.metadata ? 
          { metadata: responseData.metadata } : 
          {};
        
        // Return result to runtime
        this.PostToRuntime("generation-complete", { 
          result, 
          type,
          ...metadata
        });
        
        return result;
      } catch (error) {
        console.error("MPC Generation error:", error);
        
        // Parse the error message
        let errorMessage = error.message || "Unknown error";
        if (error.name === "AbortError") {
          errorMessage = "Generation request timed out. Please try again or check your API configuration.";
        }
        
        this.PostToRuntime("generation-error", { 
          error: errorMessage,
          type 
        });
        
        throw error; // Re-throw for async handling
      }
    }
  }
  
  // Register DOM handler
  self.RuntimeInterface.AddDOMHandlerClass(DOM_COMPONENT_ID, MPCGameGeneratorDOMHandler);
}