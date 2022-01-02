import LRU from "lru-cache"

const myCache = new LRU({ max: 1000, maxAge: 1000 * 60 * 30}) // 1000ms = 1 second, total 30 minutes to live.

abstract class ServerCache{
  public static get(key: string){
    return myCache.get(key)
  }

  public static set(key: string, value: unknown){
      myCache.set(key,value)
  }

}
export { ServerCache };