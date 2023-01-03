

export class StorageService{
    //storage = global.window.localStorage
    save(key:string, data:any){
      //  return this.storage.setItem(key, data)
    }

    get(key:string){
        //return this.storage.getItem(key)
        return key
    }
}