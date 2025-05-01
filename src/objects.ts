import { EditorView } from "codemirror";
import { SimulatorRunner } from "./simulator/simulator";

  


export class Table{
    arr: Content[][] = [];
    rows:number = 0;
    cols:number = 0;
    name:string = "";
    tableId:string = "target-div";
    classes:string[] = [] ;
    constructor(rowCount:number, colCount:number,name:string,tableId:string,classes:string[] = []) {
        this.rows = rowCount;
        this.cols = colCount;
        this.name = name;
        this.tableId = tableId;
        this.arr = [];
        this.classes = classes;
    }
    init() {
        // Dynamically create the table data
        
        const tableData:Content[][] = [];
        let ctr = 0;
        for (let i = 0; i < this.rows; i++) {
            
            const newRows:Content[] = [];
            for (let j = 0; j < this.cols; j++) {
                let c = this.contentGen({ctr,i,j});
                newRows.push(c); // Add cell content
                ctr+=1;
            }
            tableData.push(newRows);
        }
    
        // Add the generated table data to the Table array
        this.arr = tableData;
        
    
    }
    setId(id:number,context:any) {
        let {row, col} = this.getRowCol(id);
        return this.set(row,col,context);
    }
    set(row:number, col:number, context:any) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        
        this.arr[row][col].content = context;
        let textctx = this.RenderCell(this.arr[row][col]); // Get the prefix render
        {
            const cellId = this.cellIdGen(row,col);
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.innerHTML = textctx; // Set cell content
            }
        }


        
        // 🛠 Trigger animation on the real cell
        const cellId = this.cellIdGen(row,col);
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.innerHTML = textctx; // Set cell content

            cell.classList.remove('glow-effect-get'); //
            cell.classList.remove('glow-effect-set'); // Restart animation trick
            void cell.offsetWidth;                // Force reflow
            cell.classList.add('glow-effect-set');    // Add the class
        }
            
    }
    getId(id:number):Content {
        let {row, col} = this.getRowCol(id);
        return this.get(row,col);

    }
    get(row:number, col:number):Content {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        
        // 🛠 Trigger animation on the real cell
        const cellId = this.cellIdGen(row,col);
        
        const cell = document.getElementById(cellId);
        
        if (cell) {
            cell.classList.remove('glow-effect-get'); // Restart animation trick
            cell.classList.remove('glow-effect-set'); //
            void cell.offsetWidth;                // Force reflow
            cell.classList.add('glow-effect-get');    // Add the class
        }


        return this.arr[row][col];
    }
    render() {
        
        // Create the table element
        const table = document.createElement('table');
        this.arr.forEach((rowData, rowIndex) => {
            const row = document.createElement('tr');
            rowData.forEach((cellData, colIndex) => {
    
                // writing cell data
                const cell = document.createElement('td');
                cell.id = `${this.name}-cell-${rowIndex}-${colIndex}`; // Assign unique ID
                let textctx = this.RenderCell(cellData); // Get the prefix render
                //let textctx = `<div class="red-text">0x${cellData.id.toString(16).padStart(2, '0')}</div>:${cellData.content}`; // Convert to hex and pad with zeros
                //dbg(textctx);
                
    
                cell.innerHTML = textctx; // Set cell content

                // css
                // Add the custom CSS classes
                for (let i = 0; i < this.classes.length; i++) {
                    
                    cell.classList.add(this.classes[i]); // Add the base CSS class
                }
                cell.classList.add('table-cell'); // Add the base CSS class
    
                
                // Add corner-specific classes
                if (rowIndex === 0 && colIndex === 0) {
                    cell.classList.add('top-left'); // Top-left corner
                } else if (rowIndex === 0 && colIndex === rowData.length - 1) {
                    cell.classList.add('top-right'); // Top-right corner
                } else if (rowIndex === this.rows - 1 && colIndex === 0) {
                    cell.classList.add('bottom-left'); // Bottom-left corner
                } else if (rowIndex === this.rows - 1 && colIndex === rowData.length - 1) {
                    cell.classList.add('bottom-right'); // Bottom-right corner
                }
    
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        const tableDiv = document.getElementById(this.tableId);
        if (tableDiv) {
            tableDiv.innerHTML = ""; // Clear previous content
            tableDiv.appendChild(table);
        } else {
            console.error(`Element with id '${this.tableId}' not found.`);
        }
        
        
        
    }
    cellIdGenFromId(id:number):string {
        let {row, col} = this.getRowCol(id);    
        return this.cellIdGen(row,col); // Assign unique ID
    }
    cellIdGen(row:number,col:number):string{
        return `${this.name}-cell-${row}-${col}`; // Assign unique ID
    }
    private getRowCol(id: number): { col: number, row: number } {
        if (id < 0 || id >= this.rows * this.cols) {
            throw new Error('Invalid id: out of bounds');
        }
    
        const row = Math.floor(id / this.cols); // divide by COLS
        const col = id % this.cols;              // modulus with COLS
    
    
        return { row, col };
    }

    // custom areas

    RenderCell(args:Content):string {
        
        return `<div class="red-text">0x${args.id.toString(16).padStart(2, '0')}:</div>${args.content}`;
    }
    contentGen(args:{ctr:number,i,j}):Content {
        let {ctr,i,j} = args;
        let a :Content =  { content: `${i + 1},${j + 1}`,id:ctr };
        return a;
    }

}

export class Ram{
    table:Table;
    constructor(rows:number,cols:number,name:string,tableId:string,classes:string[] = []){
        
        
        this.table = new Table(rows,cols,name,tableId,classes);
        this.table.contentGen = zeroContent;
        this.table.init();
    }
    getId(id:number):Content {
        // todo trigger cache
        return this.table.getId(id);
    }
    setId(id:number,context:any) {
        // todo trigger cache
        
        return this.table.setId(id,context);
    }
    reset():void{
        this.table.init();
        this.table.render();
    }
}

function zeroContent(args:{ctr:number,i,j}):Content {

    return { content: "0", id: args.ctr };
}

export class Program{

}
export class Content{
    content: string;
    id: number; 
}
export let codeTable = {
    
};

export class Flags{
    sign: boolean = false;
    carry: boolean = false;
    overflow: boolean = false;

    // importante
    zero: boolean = false;
    parity: boolean = false;
    bigger: boolean = false;
    smaller: boolean = false;
    reset():void{
        this.sign = false;
        this.carry = false;
        this.overflow = false;

        
        this.zero = false;
        this.parity = false;
        this.bigger = false;
        this.smaller = false;
    }
}
export class Registers {
    private _r1: number = 0;
    private _r2: number = 0;
    private _r3: number = 0;
    private _r4: number = 0;
    private _r5: number = 0;
    private _r6: number = 0;
    private _r7: number = 0;
    private _r8: number = 0;
    private _r9: number = 0;
    private _rsp: number = 0;
    private _rbp: number = 0;
    private _ctr: number = 0;

    table: Table = new Table(4, 3, "registers", "register-div");

    constructor() {
        this.table.RenderCell = function (args: Content): string {
            const registerNames = [
                "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "rsp", "rbp","ctr"
            ];
            const registerName = registerNames[args.id] || "unknown";
            return `<div class="red-text">${registerName}:</div> ${args.content}`;
        };

        this.table.contentGen = zeroContent;


        this.table.init();
    }

    get r1(): number {
        this.table.getId(0);
        return this._r1;
    }
    get r2(): number {
        this.table.getId(1);
        return this._r2;
    }
    get r3(): number {
        this.table.getId(2);
        return this._r3;
    }
    get r4(): number {
        this.table.getId(3);
        return this._r4;
    }
    get r5(): number {
        this.table.getId(4);
        return this._r5;
    }
    get r6(): number {
        this.table.getId(5);
        return this._r6;
    }
    get r7(): number {
        this.table.getId(6);
        return this._r7;
    }
    get r8(): number {
        this.table.getId(7);
        return this._r8;
    }
    get r9(): number {
        this.table.getId(8);
        return this._r9;
    }
    get rsp(): number {
        this.table.getId(9);
        return this._rsp;
    }
    get rbp(): number {
        this.table.getId(10);
        return this._rbp;
    }
    get ctr(): number {
        this.table.getId(11);
        return this._ctr;
    }
    

    set r1(value: number) {
        this._r1 = value;
        this.table.setId(0, `${this._r1}`);
        }
    set r2(value: number) {
        this._r2 = value;
        this.table.setId(1, `${this._r2}`);
        }
    set r3(value: number) {
        this._r3 = value;
        this.table.setId(2, `${this._r3}`);
        }
    set r4(value: number) {
        this._r4 = value;
        this.table.setId(3, `${this._r4}`);
        }
    set r5(value: number) {
        this._r5 = value;
        this.table.setId(4, `${this._r5}`);
        }
    set r6(value: number) {
        this._r6 = value;
        this.table.setId(5, `${this._r6}`);
        }
    set r7(value: number) {
        this._r7 = value;
        this.table.setId(6, `${this._r7}`);
        }
    set r8(value: number) {
        this._r8 = value;
        this.table.setId(7, `${this._r8}`);
        }
    set r9(value: number) {
        this._r9 = value;
        this.table.setId(8, `${this._r9}`);
        }
    set rsp(value: number) {
        this._rsp = value;
        this.table.setId(9, `${this._rsp}`);
        }
    set rbp(value: number) {
        this._rbp = value;
        this.table.setId(10, `${this._rbp}`);
    }
    set ctr(value: number) {
        console.log("set ctr",value);
        
        this._ctr = value;
        this.table.setId(11, `${this._ctr}`);
    }

    reset(): void {
        this.r1 = 0;
        this.r2 = 0;
        this.r3 = 0;
        this.r4 = 0;
        this.r5 = 0;
        this.r6 = 0;
        this.r7 = 0;
        this.r8 = 0;
        this.r9 = 0;
        this.rsp = 0;
        this.rbp = 0;
        this.ctr = 0;
        this.table.render(); // Re-render the table
    }

}

export enum CacheType {
    FIFO,
    LRU
}

export class Cache{
    private _type : CacheType = CacheType.FIFO;// fifo , lru

}




// do not touch this
export let StoredObjects = {};
export let Simulator:SimulatorRunner = new SimulatorRunner();
