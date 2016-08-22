# @kuali/client-build

A package to make front-end builds much simpler. Gone are the days where you can
just slap a `<script>` and a `<link>` tag on an html page and be ready to go.
With the oversaturated configurations for babel and webpack, it can be hard to
set up your config and not have to mess with it. This package aims at being that
"configurationless" package that can help you focus on developing awesome apps!

This package has default configs as decided upon by the devs at KualiCo. Here
are some of the features:

- es2015/2016
- trailing function commas
- async/await
- class properties
- object rest/spread
- resolves `.json`
- css modules
- postcss/autoprefixer
- file loader
- html loader

All that said, this whole setup is open for debate. We tried to accomodate a lot
of requested functionality, but it might come at a cost of build size

# Project Setup

We aren't quite as sophisticated as `create-react-app` in that we don't generate
a project boilerplate for you. Refer to this guide for setting up your project.

## Directory Structure

Your project directory should look like this:

```
your-project/
├─┬ src/
│ ├── index.js
│ └── (any other files treating index.js as the entry)
├── index.html
└── package.json
```

For a quick setup, you can run the following script (on a *nix machine):

```sh
mkdir your-project # Change `your-project` to the name of your project
cd $_ # Move into the directory
npm init -y # Initialize the package.json
touch index.html # Create blank index.html
mkdir src # Make src directory
touch src/index.js # Create blank index.js
```

Next, install this package:

```sh
npm install --save-dev @kuali/client-build
```

Add the following scripts to your `package.json`

```js
{
  "scripts": {
    "start": "client-build start",
    "build": "client-build build"
  }
}
```

Now from in your project directory, you can run the following commands:

```sh
# Runs development server at port 8080
npm start
```

```sh
# Runs the production build and puts the contents in the `build/` directory
npm run build
```

If you want to proxy requests to another server, in your `package.json`, specify
a `config.proxy` value.

```js
{
  "config": {
    "proxy": {
      "/api*": {
        "target": "http://localhost:3000"
      }
    }
  }
}
```

If you want to have a different directory where your client stuff lives, then
specify a `config.clientDir` property in your `package.json`.

```js
{
  "config": {
    "clientDir": "client"
  }
}
```

This really just changes where your `index.html` and your `src` gets read from.

If you want to have additional directories where modules can be loaded from
without having to put in a relative path, then you can use the
`"modulesDirectories"` option in the config. For example, if you have the
following setup:

```js
// src/index.js
import MainComponent from 'common/MainComponent'
```

```js
// lib/common/MainComponent.js
import React from 'react'

export default () => (<h1>Hello World</h1>)
```

```js
// package.json
{
  "config": {
    "modulesDirectories": "lib"
  }
}
```

Now in addition to having paths being resolved in `node_modules`, paths can now
be resolved in additional directories. You can pass in an array or a single
value.

Additional configuration will be made available upon request.
