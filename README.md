# Visualforce Webpack Plugin [![Build Status](https://travis-ci.org/coveo/visualforce-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/coveo/visualforce-html-webpack-plugin)

A Webpack plugin to generate HTML file from Salesforce Visualforce pages. This is especially usefull to locally develop Visualforce pages without having to deploy to Salesforce.

# Installation
Install the plugin with npm:
```
npm install --save-dev visualforce-html-webpack-plugin
```

# Basic usage
The plugin will generate an HTML file for you for each Visualforce pages present in your workspace.
Just add the plugin to your webpack config as follows:
```javascript
var VisualforceHtmlPlugin = require('visualforce-html-webpack-plugin');
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [new VisualforceHtmlPlugin(/* config */)]
};
```

# Configuration
Since Visualforce pages can have multiple references to your Salesforce organization, it is possible to "mock" most of them using the VisualforceHtmlPlugin configuration file

```javascript
var config = {
  SalesforceContext: {
    CustomModifiers: {
      '<MyNameSpace:MyComponent.*?></MyNameSpace:MyComponent>': 
      `<script  src="myscripts/mystuff.js"></script>
      <link rel="stylesheet" href="mycss/mystuff.css"/>`
    },
    Resources: {
      jquery: "jquery/dist/"
    },
    Controllers: {
      MyController: {
        foo: "bar",
        fooFile: { file: "bar.json" }
      }
    }
  }
};
```

This configuration will resolve `$Resource.jquery` and `{!foo}` in your pages allowing you to use the same `<apex:stylesheet>` and `<apex:includeScript>` imports you would in Salesforce.

The CustomModifiers option allow to specify a regex to match a resource in your Visualforce page, and the content with which to replace it.
