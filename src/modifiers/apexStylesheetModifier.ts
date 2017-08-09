import cheerio = require('cheerio')
import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var ApexStylesheetModifier: IModifier<string, string> = (asset: IAsset<string>) => {
    return new Promise<IAsset<string>>((resolve, reject) => {

        var reg = new RegExp("<apex:stylesheet value=\"(.*?)\" \/>", "g");
        var assetData = asset.data;
        var result: RegExpExecArray;

        while ((result = reg.exec(asset.data)) !== null) {
            assetData = assetData.replace(result[0],
                `<link href='${result[1]}' rel='stylesheet' type='text/css' />`);
        }

        resolve({
            ...asset,
            data: assetData
        });
    })
}