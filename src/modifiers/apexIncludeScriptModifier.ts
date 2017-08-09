import cheerio = require('cheerio')
import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var ApexIncludeScriptModifier: IModifier<string, string> = (asset: IAsset<string>) => {
    return new Promise<IAsset<string>>((resolve, reject) => {
        var reg = new RegExp("<apex:includeScript value=\"(.*?)\" \/>", "g");
        var assetData = asset.data;
        var result: RegExpExecArray;

        while ((result = reg.exec(asset.data)) !== null) {
            assetData = assetData.replace(result[0],
                `<script src='${result[1]}' type='application/javascript'></script>`);
        }

        resolve({
            ...asset,
            data: assetData
        });
    })
}