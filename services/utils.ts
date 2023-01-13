export function replaceAll(
  search: string,
  replacement: string,
  target?: string
) {
  return target?.split(search).join(replacement);
}
