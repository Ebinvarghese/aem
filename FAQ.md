## How do I take advantage of Webpack?
Webpack is part of the base AEM project template. In order to use Webpack, place an entry file within your module source directory. The file should end with `.entry.extension` where `extension` is any code file extension you wish to use. Within your entry file, import or require the source files necessary to kick off your module.

For example, if we wanted to make a new promo module, the directory structure would look something like:

```
apps
└─src
└──main
└───content
└────jcr_root
└─────etc
└──────clientlibs
└───────promo
└────────src
         │ promo.entry.ts
         │ promo.service.ts
         │ promo.component.ts
```

The `promo.entry.ts` would look similar to:

```ts
import { PromoComponent } from './promo.component';
import { PromoService } from './promo.service';

// Initialize module on DOM
```

---

## Do I have to use Typescript?
No but it is recommended. Since Webpack is used to bundle all source code, Typescript can be used without worrying about browser compatibility or the risk that non-transpiled code would be sent to the browser. Typescript brings along a lot of nice features like static typing that will help you catch common mistakes and bugs before the code is delivered to any front-end environment.

You can use a combination of Typescript and JavaScript modules and source code. If you wish to use JavaScript, it is still recommended to make use of all ES6+ features. BabelJS is used in the Webpack configuration to transpile ES6 code to ES5 making it compatible with 99% of browsers on the market today.

---

## Can I use CoffeScript or another transpiled language?
Yes but you will need to configure Webpack to understand how those source files should be transpiled. In most cases, it is as simple as adding a new loader. The base configuration only supports Typescript and Javascript.

---

## What styling languages are supported?
CSS and SCSS are supported by the base Webpack configuration. However, if you would like to use LESS or another styling language, you may do so. Just remember to add the appropriate loader to the Webpack configuration.

---

## How is browser compatibility ensured with styles?
Browser compatibility is ensured through the use of the PostCSS dependency and it's plugins. PostCSS is a modular post-processor that is executed via Webpack on all CSS sources. The plugins included in the template are autoprefixer and cssnano. These work in conjunction with a browserslist ruleset to provide minified CSS that is compatible with the browserlist rules within the project. More info can be found at the below links.

[postcss](https://github.com/postcss/postcss) --
[autoprefixer](https://github.com/postcss/autoprefixer) --
[cssnano](https://github.com/ben-eb/cssnano)

---

## How do I setup my browserslist rules?
Update the `package.json` file with a `browserslist` configuration. This template contains the minimum requirements for Sprint web projects. More information on how to configure and use browserslist can be found [here](https://github.com/ai/browserslist).

---
