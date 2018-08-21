import fs = require('fs');
import path = require('path');
import glob = require('glob');
import Promise = require('promise');

import { IAsset } from './modifiers/modifier';
import { WebpackAssetModifier } from './modifiers/webpackAssetModifier';
import { ApexIncludeScriptModifier } from './modifiers/apexIncludeScriptModifier';
import { ApexStylesheetModifier } from './modifiers/apexStylesheetModifier';
import { ApexResourcesModifier } from './modifiers/apexResourcesModifier';
import { ApexUrlforModifier } from './modifiers/apexUrlforModifier';
import { ApexSyntaxCleanModifier } from './modifiers/apexSyntaxCleanModifier';
import { ApexVariablesModifier } from './modifiers/apexVariablesModifier';
import { ApexCustomModifier, ICustomModifier } from './modifiers/apexCustomModifier';
import { Compiler } from 'webpack';

export interface SalesforceContext {
  Resources: { [resource: string]: string };
  Controllers: { [resource: string]: string };
  CustomModifiers: ICustomModifier;
}

export interface IVisualforceHtmlPluginOptions {
  SalesforceContext: SalesforceContext;
}

export const defaultOptions: IVisualforceHtmlPluginOptions = {
  SalesforceContext: {
    CustomModifiers: {},
    Resources: {},
    Controllers: {}
  }
};

export class VisualforceHtmlPlugin {
  constructor(public options: IVisualforceHtmlPluginOptions = defaultOptions) {}

  public apply(compiler: Compiler) {
    compiler.hooks.emit.tap('visualforce-html-plugin', (compilation: any, callback: (...args: any[]) => void) => {
      this.getAllPages().then(
        files => {
          const filePromises: Promise<IAsset<string>>[] = [];

          files.forEach(f => {
            filePromises.push(
              this.readFile(f, compiler)
                .then(asset => ApexResourcesModifier(asset, this.options.SalesforceContext.Resources))
                .then(ApexUrlforModifier)
                .then(ApexStylesheetModifier)
                .then(ApexIncludeScriptModifier)
                .then(asset => ApexVariablesModifier(asset, compilation, this.options.SalesforceContext.Controllers))
                .then(asset => ApexCustomModifier(asset, this.options.SalesforceContext.CustomModifiers))
                .then(ApexSyntaxCleanModifier)
                .then(asset => WebpackAssetModifier(asset, compilation))
            );
          });

          Promise.all(filePromises).then(() => {
            callback();
          });
        },
        reason => {
          console.log(reason);
        }
      );
    });
  }

  private getAllPages(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      glob('**/*.page', (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(files);
      });
    });
  }

  private readFile(fileName: string, compiler: any): Promise<IAsset<string>> {
    return new Promise<IAsset<string>>((resolve, reject) => {
      fs.readFile(fileName, 'UTF-8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          path: path.join(compiler.context, fileName),
          name: path.parse(fileName).name,
          data: data
        });
      });
    });
  }
}
