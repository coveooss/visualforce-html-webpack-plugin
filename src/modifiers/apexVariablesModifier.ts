import Promise = require('promise');
import fs = require('fs');
import { IModifier, IAsset } from './modifier';

export const ApexVariablesModifier: IModifier<string, string> = (
  asset: IAsset<string>,
  compilation: any,
  controllers: { [controller: string]: any }
) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    if (controllers) {
      let reg = /<apex:page.*controller="([a-zA-Z0-9]*)".*>/g;
      let result = reg.exec(asset.data);

      if (result) {
        const controller = controllers[result[1]];
        if (controller) {
          Object.keys(controller).forEach(variable => {
            reg = new RegExp(`{!.*?${variable}.*?}`, 'g');

            while ((result = reg.exec(asset.data)) !== null) {
              const data = controller[variable];
              let value;

              if (typeof data === 'object' && data.file) {
                try {
                  value = fs.readFileSync(data.file, 'UTF-8');
                } catch (ex) {
                  console.log(ex);
                }
              } else if (typeof data === 'string') {
                value = data;
              }

              if (value) {
                asset.data = asset.data.replace(result[0], value);
              }
            }
          });
        }
      }
    }

    resolve(asset);
  });
};
