# adonisjs-create-service

Adonis command for creating service

Inspired by [getsolaris/laravel-make-service-command](https://github.com/getsolaris/laravel-make-service-command)

## Install

`adonis install hyungju/adonisjs-create-service`

## Register Command

Register command inside `start/app.js` file.

```js
const commands = ["adonisjs-create-service/providers/ServiceCommand"];
```

## Use

Run

```js
  adonis make:serive {NameService}
```

And register provider inside `start/app.js`

```js
const providers = [
  ...
  '../providers/{NameService}' or path.join(__dirname, '..', 'providers/{NameService}'),
  ...
]
```
