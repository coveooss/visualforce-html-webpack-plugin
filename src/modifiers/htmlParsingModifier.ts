import cheerio = require('cheerio')
import Promise = require('promise');
import { IModifier, IAsset } from './modifier'

export var StringToHtmlParsingModifier: IModifier<string, Cheerio> = (asset: IAsset<string>) => {
    return new Promise<IAsset<Cheerio>>((resolve, reject) => {

        // We need to replace the "apex:module" format since this isn't HTML complient
        asset.data = asset.data.replace(/<apex:/g, '<apex');
        const $ = cheerio.load(asset.data, { xmlMode: true, lowerCaseTags: true });

        resolve({
            ...asset,
            data: $('apexpage')
        });
    })
}

export var HtmlToStringParsingModifier: IModifier<Cheerio, string> = (asset: IAsset<Cheerio>) => {
    return new Promise<IAsset<string>>((resolve, reject) => {

        resolve({
            ...asset,
            data: "<html><body>" + asset.data.html() + "</body></html>"
        });
    })
}