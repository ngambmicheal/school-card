export default function stripBom(str: string) {
    if (str.charCodeAt(0) === 0xfeff) {
      return str.slice(1)
    }
  
    return str
  }
  
  export function stripBomFromKeys<K, T extends Record<string, K>>(
    obj: T
  ): Record<string, K> {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [stripBom(k), v])
    )
  }
  