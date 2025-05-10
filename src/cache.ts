import { Content, Table } from "./objects";

export enum CacheType {
    FIFO,
    LRU
}

class CacheCell {
    ownId:number = 0;
    storedId:number = 0;
    data:number = 0;
    constructor(){

    }
}

class CacheCellList{
    list:CacheCell[];
    size:number;
    constructor(rowsize:number,colsize:number){
        this.size = rowsize * colsize;
        this.list = []
        for (let i = 0; i < this.size; i++){
            const cell = new CacheCell();
            cell.data = 0;
            cell.ownId = i;
            cell.storedId = 0;
            this.list.push(cell);
        };
    }
    getCell(id:number):CacheCell{
        return this.list[id]
    }
}

export class Cache{
    private _type : CacheType = CacheType.FIFO;// fifo , lru
    table:Table;
    cachedItems:CacheCellList;
    constructor(rowsize:number,colsize:number,name:string,table_id:string,classes?:string[]){
        this.table = new Table(rowsize,colsize,name,table_id,classes);
        this.table.contentGen = zeroContent;
        this.cachedItems = new CacheCellList(rowsize,colsize);
    }

    getId(id:number):Content | null {
        // todo trigger cache
        this.setInner
        return this.table.getId(id);
    }
    setId(id:number,context:any):boolean {
        // todo trigger cache
        return this.setInner(id,context);
        
    }
    reset():void{
        this.table.init();
        this.table.render();
    }   
    idLookup(id:number):number|null{
        for (let x in this.cachedItems.list){
            
            console.log(this.cachedItems.getCell(Number(x)));
            
            let stored = this.cachedItems.getCell(Number(x));

            if (stored.storedId === id){
                return this.cachedItems[x].storedId as number;
            }
        }
        return null
    }
    setInner(id:number,context:number):boolean{
        switch(this._type){
            case CacheType.FIFO:{
                    let res = this.LRU(id,context)
                    return res;
                }
            case CacheType.LRU:{
                    let res = this.FIFO(id,context)
                    return res;
                }
        }
    }
    LRU(id:number,context:number):boolean{
        console.log("sa");
        



        return true
    }
    FIFO(id:number,context:number):boolean{
        console.log("fifo");
        
        return true
    }
}

function zeroContent(args:{ctr:number,i:number,j:number}):Content {

    return { content: "", id: NaN };
}
