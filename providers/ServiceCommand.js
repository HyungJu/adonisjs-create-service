"use strict";

const { Command } = require("@adonisjs/ace");
const fs = require("fs");
const path = require("path");
const Helpers = use("Helpers");
const replace = require("replace-in-file");

class ServiceCommand extends Command {
  static get signature() {
    return "make:service {name}";
  }

  static get description() {
    return "Create a new service";
  }

  async handle(args, options) {
    this.createService(args.name);
  }

  async createService(name) {
    name = this.capitalizeString(name);
    const file = name + ".js";

    if (
      fs.existsSync(Helpers.appRoot("app/Services/" + file)) ||
      fs.existsSync(Helpers.appRoot(`providers/${name}Provider.js`))
    ) {
      this.failed("create", "Service or Provider exists!");
      return false;
    }

    await this.ensureDir(Helpers.appRoot("app/Services"));

    const servicePath = Helpers.appRoot("app/Services/" + file);
    await this.copy(
      path.resolve(__dirname, "../src/Services/Service.js"),
      servicePath
    );

    await replace({
      files: servicePath,
      from: /ServiceName/g,
      to: name,
    });
    await this.createIocService(name, file);
    this.completed(
      "create",
      `app/Services/${file} and providers/${name}Provider.js`
    );
  }

  async createIocService(name, file) {
    await this.ensureDir(Helpers.appRoot("providers"));
    await this.copy(
      path.resolve(__dirname, "../src/Providers/Provider.js"),
      Helpers.appRoot(`providers/${name}Provider.js`)
    );

    await replace({
      files: Helpers.appRoot(`providers/${name}Provider.js`),
      from: /ProviderName/g,
      to: `${name}Provider`,
    });
    // Creating the name for ServiceProvider access
    await replace({
      files: Helpers.appRoot(`providers/${name}Provider.js`),
      from: /IocName/g,
      to: `App/Services/${name}`,
    });

    // Adding the path to the Service file
    await replace({
      files: Helpers.appRoot(`providers/${name}Provider.js`),
      from: /path/g,
      to: `../app/Services/${file}`,
    });
  }

  async checkServiceName(name) {
    if (name.indexOf("Service")) {
      return this.capitalizeString(name);
    } else if (name.indexOf("service")) {
      return this.capitalizeString(name.replace("service", "Service"));
    } else {
      return this.capitalizeString(name + "Service");
    }
  }

  capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

module.exports = ServiceCommand;
