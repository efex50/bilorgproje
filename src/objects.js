import { dbg } from "./debug";

export let Ram = {
    arr: [],
    lines: 0,
    rows: 0,
    name: "mem",
    tableId: "ram-div",
    set: function(line, row, context) {
        if (line < 0 || line >= this.lines || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        this.arr[line][row].content = context.toString();
        this.render();
    },
    get: function(line, row) {
        if (line < 0 || line >= this.lines || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        return this.arr[line][row];
    },
    render:function () {
        
        // Create the table element
        const table = document.createElement('table');
        this.arr.forEach((rowData, rowIndex) => {
            const row = document.createElement('tr');
            rowData.forEach((cellData, colIndex) => {
    
                // writing cell data
                const cell = document.createElement('td');
                cell.id = `${this.name}-cell-${rowIndex}-${colIndex}`; // Assign unique ID
                //dbg(cellData);
                let textctx = `<div class="red-text">0x${cellData.id.toString(16).padStart(2, '0')}</div>:${cellData.content}`; // Convert to hex and pad with zeros
                //dbg(textctx);
                
    
                cell.innerHTML = textctx; // Set cell content
                cell.classList.add('table-cell'); // Add the base CSS class
    
    
                // css
                // Add corner-specific classes
                if (rowIndex === 0 && colIndex === 0) {
                    cell.classList.add('top-left'); // Top-left corner
                } else if (rowIndex === 0 && colIndex === rowData.length - 1) {
                    cell.classList.add('top-right'); // Top-right corner
                } else if (rowIndex === this.lines - 1 && colIndex === 0) {
                    cell.classList.add('bottom-left'); // Bottom-left corner
                } else if (rowIndex === this.lines - 1 && colIndex === rowData.length - 1) {
                    cell.classList.add('bottom-right'); // Bottom-right corner
                }
    
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        const tableDiv = document.getElementById(Ram.tableId);
        tableDiv.innerHTML = ""; // Clear previous content
        tableDiv.appendChild(table);
        
    
    },
    
};

export class Table{
    //arr = [];
    //rows = 0;
    //cols = 0;
    //name = "";
    //tableId = "target-div";
    // classes = string[] = ["table-cell",...];
    constructor(rowCount, colCount,name,tableId,classes) {
        this.rows = rowCount;
        this.cols = colCount;
        this.name = name;
        this.tableId = tableId;
        this.arr = [];
        this.classes = classes || [];
    }
    init() {
        // Dynamically create the table data
        
        const tableData = [];
        let ctr = 0;
        for (let i = 0; i < this.rows; i++) {
            
            const newRows = [];
            for (let j = 0; j < this.cols; j++) {
                
                newRows.push({ content: `${i + 1},${j + 1}`,id:ctr }); // Add cell content
                ctr+=1;
            }
            tableData.push(newRows);
        }
    
        // Add the generated table data to the Table array
        this.arr = tableData;
        
    
    }
    set(row, col, context) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        this.arr[row][col].content = context.toString();
        this.render();
    }
    get(row, col) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            throw new Error('Invalid line or row index');
        }
        return this.arr[line][row];
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
                let textctx = `<div class="red-text">0x${cellData.id.toString(16).padStart(2, '0')}</div>:${cellData.content}`; // Convert to hex and pad with zeros
                //dbg(textctx);
                
    
                cell.innerHTML = textctx; // Set cell content

                // css
                // Add the custom CSS classes
                for (let i = 0; i < this.classes.length; i++) {
                    
                    cell.classList.add(this.classes[i]); // Add the base CSS class
                }
                cell.classList.add('table-cell'); // Add the base CSS class
    
                console.log(this.rows);
                
                // Add corner-specific classes
                if (rowIndex === 0 && colIndex === 0) {
                    cell.classList.add('top-left'); // Top-left corner
                } else if (rowIndex === 0 && colIndex === rowData.length - 1) {
                    cell.classList.add('top-right'); // Top-right corner
                } else if (rowIndex === this.lines - 1 && colIndex === 0) {
                    cell.classList.add('bottom-left'); // Bottom-left corner
                } else if (rowIndex === this.lines - 1 && colIndex === rowData.length - 1) {
                    cell.classList.add('bottom-right'); // Bottom-right corner
                }
    
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        const tableDiv = document.getElementById(this.tableId);
        tableDiv.innerHTML = ""; // Clear previous content
        tableDiv.appendChild(table);
        
        
        
    }
    cellIdGen(id) {
        if ( id < 0 || id >= this.rows * this.cols) {
            throw new Error('Invalid id: out of bounds');
        }
        const col = Math.floor(id / this.cols);
        const row = id % this.rows;
    
        return `${this.name}-cell-${row}-${col}`; // Assign unique ID
    }
}



export let Registers = {
    rax : 0,
    rbx : 0,
    rcx : 0,
    rdx : 0,
}