"use strict";

// Import all runtime files
import "./plugin.js";
import "./type.js";
import "./instance.js";

// Set up conditions
const C3 = self.C3;
const Cnds = C3.Plugins.MPC_GameGenerator.Cnds;

Cnds.IsGenerating = function() {
  return this.IsGenerating();
};

Cnds.OnGenerationStart = function() {
  return this.OnGenerationStart();
};

Cnds.OnGenerationComplete = function() {
  return this.OnGenerationComplete();
};

Cnds.OnCodeGenerationComplete = function() {
  return this.OnCodeGenerationComplete();
};

Cnds.OnObjectGenerationComplete = function() {
  return this.OnObjectGenerationComplete();
};

Cnds.OnSpriteGenerationComplete = function() {
  return this.OnSpriteGenerationComplete();
};

Cnds.OnGenerationError = function() {
  return this.OnGenerationError();
};

// Set up actions
const Acts = C3.Plugins.MPC_GameGenerator.Acts;

Acts.GenerateCode = function(prompt) {
  this.GenerateCode(prompt);
};

Acts.GenerateObject = function(prompt) {
  this.GenerateObject(prompt);
};

Acts.GenerateSprite = function(prompt) {
  this.GenerateSprite(prompt);
};

Acts.GenerateGame = function(prompt) {
  this.GenerateGame(prompt);
};

Acts.CancelGeneration = function() {
  this.CancelGeneration();
};

Acts.SetApiKey = function(key) {
  this.SetApiKey(key);
};

Acts.SetApiEndpoint = function(endpoint) {
  this.SetApiEndpoint(endpoint);
};

Acts.SetModel = function(model) {
  this.SetModel(model);
};

Acts.SetSystemPrompt = function(prompt) {
  this.SetSystemPrompt(prompt);
};

// Set up expressions
const Exps = C3.Plugins.MPC_GameGenerator.Exps;

Exps.GetResult = function() {
  return this.GetResult();
};

Exps.GetError = function() {
  return this.GetError();
};

Exps.GetMetadata = function(key) {
  return this.GetMetadata(key || "");
};

Exps.GetGenerationType = function() {
  return this.GetGenerationType();
};

// This is the entry point for our addon's runtime scripts