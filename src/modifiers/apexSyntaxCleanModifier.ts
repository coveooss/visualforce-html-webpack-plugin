import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var ApexSyntaxCleanModifier: IModifier<string, string> = (asset: IAsset<string>) => {
    return new Promise<IAsset<string>>((resolve, reject) => {
        var reg = /{!(.*)}/g
        var assetData = asset.data;
        var result: RegExpExecArray;

        while ((result = reg.exec(asset.data)) !== null) {
            assetData = assetData.replace(result[0], result[1]);
        }

        reg = /<apex:page(.*?)>/g;
        while ((result = reg.exec(assetData)) !== null) {
            assetData = assetData.replace(result[0], "");
        }

        reg = /<\/apex:page>/g;
        while ((result = reg.exec(assetData)) !== null) {
            assetData = assetData.replace(result[0], "");
        }

        resolve({
            ...asset,
            data: '<html><body>' + assetData + "</body></html>"
        });
    })
}