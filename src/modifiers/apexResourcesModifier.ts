import Promise = require('promise');
import { IModifier, IAsset } from './modifier';

export const ApexResourcesModifier: IModifier<string, string> = (asset: IAsset<string>, resources: { [resource: string]: string }) => {
  return new Promise<IAsset<string>>((resolve, reject) => {
    if (resources) {
      Object.keys(resources).forEach(r => {
        const reg = new RegExp(`\\$Resource\\.${r}`, 'g');
        asset.data = asset.data.replace(reg, `'${resources[r]}'`);
      });
    }
    resolve(asset);
  });
};
