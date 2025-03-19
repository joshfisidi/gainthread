const PLUGIN_ID = "MPC_GameGenerator";
const PLUGIN_CATEGORY = "general";

const PLUGIN_CLASS = SDK.Plugins.MPC_GameGenerator = class MPCGameGeneratorPlugin extends SDK.IPluginBase {
  constructor() {
    super();
  }
  
  Release() {
    // Release any resources this plugin might be using
  }
  
  OnCreate() {
    // Set plugin configuration
    this._info.SetName(this._runtime.Translate("plugins.mpc_gamegenerator.name"));
    this._info.SetDescription(this._runtime.Translate("plugins.mpc_gamegenerator.description"));
    this._info.SetVersion("1.0.0.0");
    this._info.SetCategory(PLUGIN_CATEGORY);
    this._info.SetAuthor("Joshua J. Gomes");
    this._info.SetHelpUrl(this._runtime.Translate("plugins.mpc_gamegenerator.help-url"));
    
    // Set as a single-global plugin
    this._info.SetIsSingleGlobal(true);
    
    // Specify DOM-side script for API calls
    this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);
    
    // Set main module script
    this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
    
    // Set properties
    this._info.SetProperties([
      new SDK.PluginProperty("text", "api-key", ""),
      new SDK.PluginProperty("text", "api-endpoint", "https://api.example.com"),
      new SDK.PluginProperty("combo", "model", {
        "initialValue": "mpc-code",
        "items": ["mpc-code", "mpc-game", "mpc-sprite"]
      }),
      new SDK.PluginProperty("longtext", "system-prompt", "You are an AI assistant that helps create Construct 3 games. Generate game elements based on the user's prompt."),
      new SDK.PluginProperty("integer", "temperature", 0.7),
      new SDK.PluginProperty("integer", "max-tokens", 2048),
      new SDK.PluginProperty("check", "auto-implement", true)
    ]);
    
    // Add common ACEs
    this._info.AddCommonACEs();
  }
};

// Register the plugin
SDK.Plugins.MPC_GameGenerator.Register(PLUGIN_ID, PLUGIN_CLASS);