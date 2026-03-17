export type AssetSource = string | { src: string };

export function resolveAssetSrc(asset: AssetSource) {
  return typeof asset === "string" ? asset : asset.src;
}