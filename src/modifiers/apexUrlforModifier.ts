import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export const ApexUrlforModifier: IModifier<string, string> = (asset: IAsset<string>) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    const reg = /URLFOR\('(\S*)',\s*'(\S*)'\)/g;
    let result: RegExpExecArray | null;
    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], result[1] + result[2]);
    }

    resolve(asset);
  });
};
