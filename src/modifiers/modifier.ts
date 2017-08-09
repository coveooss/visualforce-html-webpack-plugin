export interface IAsset<T> {
    path: string,
    name: string,
    data: T
}

export interface IModifier<T, G> {
    (asset: IAsset<T>, ...params: any[]): IAsset<G> | Promise<IAsset<G>>
}