'use strict'

const { Command } = require('@adonisjs/ace')
const fs = require('fs')
const path = require('path')
const Helpers = use('Helpers')
const replace = require('replace-in-file');

class ServiceCommand extends Command {
  static get signature () {
    return 'make:service {name}'
  }

  static get description () {
    return 'Create a new service'
  }


  async handle (args, options) {
    this.createService(args.name)
  }

  async createService(name){
    name = this.capitalizeString(name)
    const file = name + ".js"

    if(fs.existsSync(Helpers.appRoot('app/Services/' + file))){
      this.failed('create', 'Service exists!')
      return false
    }

    await this.ensureDir(Helpers.appRoot('app/Services'))
    await this.copy(path.resolve(__dirname, '../src/Services/Service.js'), Helpers.appRoot('app/Services/' + file))

    await replace({
      files: Helpers.appRoot('app/Services/' + file),
      from: /ServiceName/g,
      to: name,
    })

    this.completed('create', 'app/Services/' + file)


  }

  async checkServiceName(name){
    if(name.indexOf("Service")){
      return this.capitalizeString(name)
    }
    else if(name.indexOf("service")) {
      return this.capitalizeString(name.replace("service", "Service"))
    }
    else{
      return this.capitalizeString(name + "Service")
    }
  }

  capitalizeString(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

}

module.exports = ServiceCommand
