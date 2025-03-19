"use strict";

/**
 * MPC Game Generator Type
 * Handles type-level functionality for the MPC Game Generator plugin
 */
class MPC_GameGeneratorType {
  constructor(objectClass) {
    this.objectClass = objectClass;
  }
  
  static getC3Version() {
    // Try to get the Construct 3 version from runtime
    try {
      return self.C3.Runtime.GetVersion() || "3.0";
    } catch(e) {
      return "3.0";
    }
  }
}

// Register the type
self.C3.Plugins.MPC_GameGenerator = { 
  Type: MPC_GameGeneratorType,
  Cnds: {},
  Acts: {},
  Exps: {}
};