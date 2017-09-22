import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export const ApexSyntaxCleanModifier: IModifier<string, string> = (asset: IAsset<string>) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    let reg = /{!(.*)}/g;
    let result: RegExpExecArray | null;

    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], result[1]);
    }

    reg = /<apex:page(.*?)>/g;
    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], '');
    }

    reg = /<\/apex:page>/g;
    while ((result = reg.exec(asset.data)) !== null) {
      asset.data = asset.data.replace(result[0], '');
    }

    resolve({
      ...asset,
      data: `<!DOCTYPE html>\n<html><body>${asset.data}</body></html>`
    });
  });
};
