import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var ApexUrlforModifier: IModifier<string, string> = (asset: IAsset<string>) => {
    return new Promise<IAsset<string>>((resolve, reject) => {
        var reg = /URLFOR\('(\S*)',\s*'(\S*)'\)/g
        var assetData = asset.data;
        var result: RegExpExecArray;

        while ((result = reg.exec(asset.data)) !== null) {
            assetData = assetData.replace(result[0],
                result[1] + result[2]);
        }

        resolve({
            ...asset,
            data: assetData
        });
    })
}