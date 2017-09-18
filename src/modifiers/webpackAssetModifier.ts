import { IModifier, IAsset } from './modifier';

export const WebpackAssetModifier: IModifier<string, null> = (asset: IAsset<string>, compilation: any) => {
  compilation.fileDependencies.push(asset.path);

  compilation.assets[asset.name + '.html'] = {
    source: () => {
      return asset.data;
    },
    size: function() {
      return asset.data.length;
    }
  };

  return {
    ...asset,
    data: null
  };
};
