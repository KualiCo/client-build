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
    "build": "client-build build",
    "test": "client-build test"
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

# Config

All configuration is put into your `package.json` under the `clientBuild` key.
There are sensible defaults for everything, but the following options are
available to you (All paths are relative to the current working directory)

- `build` - Defaults to `'build'`. This is the directory where you built assets
  are put into.
- `html` - Defaults to `'index.html'`. The path to your `index.html`
- `src` - Defaults to `'src'`. The directory where your client source code is.
- `tests` - An array of patterns for your test files. Defaults to:
  ```js
  [
    '**/__tests__/*.js',
    '**/*.spec.js',
    '**/*.test.js',
  ]
  ```
- `modulesDirectories` - Defaults to `null`. If you'd like to have additional
  directories that `require()` will resolve to (so you don't have to put in
  relative paths), then pass in an array of paths to directories here.
- `testSetup` - Defaults to `null`. If you have any files that need to
  be `require`d before tests start running, to it there. You may pass in an
  array of files.
- `dashboard` - Defaults to `true`. Shows the webpack dashboard for the start
  command.
- `proxy` - Defaults to `null`. This is for proxy options that gets passed into
  `webpack-dev-server`
- `port` - Defaults to `8080`. The port to bind to for development.

Additional configuration can be added upon request and further discussion. The
idea is to minimize the amount of configuration you need to get started while
also being flexible to other people's development environments.
