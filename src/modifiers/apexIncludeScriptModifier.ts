import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export const ApexIncludeScriptModifier: IModifier<string, string> = (asset: IAsset<string>) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    const reg = new RegExp('<apex:includeScript value="(.*?)" />', 'g');
    let result: RegExpExecArray | null;

    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], `<script src='${result[1]}' type='application/javascript'></script>`);
    }

    resolve(asset);
  });
};
