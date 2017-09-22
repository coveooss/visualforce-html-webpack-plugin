import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export const ApexStylesheetModifier: IModifier<string, string> = (asset: IAsset<string>) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    const reg = new RegExp('<apex:stylesheet value="(.*?)" />', 'g');
    let result: RegExpExecArray | null;

    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], `<link href='${result[1]}' rel='stylesheet' type='text/css' />`);
    }
    resolve(asset);
  });
};
