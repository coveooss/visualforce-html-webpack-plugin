import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export type ICustomModifier = { [regexkey: string]: string };

export const ApexCustomModifier: IModifier<string, string> = (asset: IAsset<string>, regexes: ICustomModifier) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    Object.keys(regexes).forEach(regexkey => {
      const reg = new RegExp(regexkey, 'g');
      const matches = reg.exec(asset.data);
      if (matches && matches.length == 1) {
        asset.data = asset.data.replace(reg, regexes[regexkey]);
      }
    });

    resolve(asset);
  });
};
