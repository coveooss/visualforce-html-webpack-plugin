import fs = require('fs');
import path = require('path');
import glob = require('glob');
import Promise = require('promise');

import { IAsset } from './modifiers/modifier'
import { WebpackAssetModifier } from './modifiers/webpackAssetModifier'
import { ApexIncludeScriptModifier } from './modifiers/apexIncludeScriptModifier'
import { HtmlToStringParsingModifier, StringToHtmlParsingModifier } from './modifiers/htmlParsingModifier'
import { ApexStylesheetModifier } from './modifiers/apexStylesheetModifier'
import { ApexResourcesModifier } from './modifiers/apexResourcesModifier'
import { ApexUrlforModifier } from './modifiers/apexUrlforModifier'
import { ApexSyntaxCleanModifier } from './modifiers/apexSyntaxCleanModifier'
import { ApexVariablesModifier } from './modifiers/apexVariablesModifier'

export interface SalesforceContext {
    Resources: { [resource: string]: string }
    Controllers: { [resource: string]: string }
}

export interface IVisualforceHtmlPluginOptions {
    SalesforceContext?: SalesforceContext
}

export var defaultOptions: IVisualforceHtmlPluginOptions = {
    SalesforceContext: {
        Resources: {},
        Controllers: {}
    }
}

export class VisualforceHtmlPlugin {
    constructor(public options: IVisualforceHtmlPluginOptions = defaultOptions) {
    }

    public apply(compiler: any) {
        compiler.plugin('emit', (compilation, callback) => {
            this.getAllPages().then(files => {
                var filePromises = [];

                files.forEach(f => {
                    filePromises.push(this.readFile(f, compiler)
                        .then((asset) => ApexResourcesModifier(asset, this.options.SalesforceContext.Resources))
                        .then(ApexUrlforModifier)
                        .then(ApexStylesheetModifier)
                        .then(ApexIncludeScriptModifier)
                        .then(asset => ApexVariablesModifier(asset, compilation, this.options.SalesforceContext.Controllers))
                        .then(ApexSyntaxCleanModifier)
                        .then((asset: IAsset<string>) => WebpackAssetModifier(asset, compilation)));
                });

                Promise.all(filePromises).then(() => {
                    callback();
                });
            }, reason => {
                console.log(reason);
            });
        });
    }

    private getAllPages(): PromiseLike<string[]> {
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
            })
        })
    }
}