import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var ApexResourcesModifier: IModifier<string, string> = (asset: IAsset<string>, resources: { [resource: string]: string }) => {
    return new Promise<IAsset<string>>((resolve, reject) => {
        if (resources) {
            var result = asset.data;

            Object.keys(resources).forEach(r => {
                var reg = new RegExp(`\\$Resource\\.${r}`, 'g');
                result = result.replace(reg, `'${resources[r]}'`);
            });
        }

        resolve({
            ...asset,
            data: result
        });
    })
}