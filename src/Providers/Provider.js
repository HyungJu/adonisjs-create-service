"use strict";

const { ServiceProvider } = require("@adonisjs/fold");

class ProviderName extends ServiceProvider {
  register() {
    this.app.singleton("IocName", () => {
      return new (require("path"))();
    });
  }
}

module.exports = ProviderName;
