const VisualforceHtmlPlugin = require('../dist/index.js');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/samples-ouput',
    filename: 'index.js'
  },
  plugins: [
    new VisualforceHtmlPlugin({
      SalesforceContext: {
        CustomModifiers: {
          '<CoveoV2:SearchInterface.*?></CoveoV2:SearchInterface>': `<script src="vendor/coveo/CoveoJsSearch.js"></script>
        <link rel="stylesheet" href="vendor/css/CoveoFullSearch.css"/>`
        },
        Controllers: {
          MyController: {
            testValueFromController: 'This is a test value from a controller'
          },
          ProvisioningController: {
            getIsSandbox: 'false',
            PlatformVersion: 'v2',
            canCreateOrg: 'true'
          },
          SetupController: {
            isIndexless: 'false'
          }
        },
        Resources: {
          jquery: 'jquery/dist/',
          underscore: 'underscore/',
          styleguide: 'coveo-styleguide/dist/',
          assets: 'assets/'
        }
      }
    })
  ]
};
