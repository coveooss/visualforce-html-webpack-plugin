import Promise = require('promise');
import fs = require('fs');
import { IModifier, IAsset } from './modifier'

export var ApexVariablesModifier: IModifier<string, string> = (asset: IAsset<string>, compilation: any, controllers: { [controller: string]: any }) => {
    return new Promise<IAsset<string>>((resolve, reject) => {
        if (controllers) {
            var assetData = asset.data;
            var reg = /<apex:page.*controller="([a-zA-Z0-9]*)".*>/g
            var result = reg.exec(asset.data)
            
            
            if (result) {
                var controller = controllers[result[1]];
                if (controller) {
                    Object.keys(controller).forEach(variable => {
                        reg = new RegExp(`{!.*?${variable}.*?}`, 'g');

                        while ((result = reg.exec(asset.data)) !== null) {
                            var data = controller[variable];
                            var value;

                            if (typeof data === 'object' && data.file) {
                                try {
                                    value = fs.readFileSync(data.file, 'UTF-8');
                                } catch (ex) {
                                    console.log(ex);
                                }

                            } else if (typeof data === 'string') {
                                value = data;
                            }

                            if (value) {
                                assetData = assetData.replace(result[0], value);
                            }
                        }
                    });
                }
            }
        }

        resolve({
            ...asset,
            data: assetData
        });
    })
}