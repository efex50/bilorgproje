import { Table,StoredObjects } from "./objects";

export function main() {
    console.log("Main function started");
    let ram = new Table(16,16,"cache","ram-div");    
    ram.init();
    ram.render();
    ram.set(0, 0, 0x01);

    let id = ram.cellIdGen(40);
    StoredObjects["ram"] = ram;
    console.log(StoredObjects);
    console.log(id);
    document.getElementById(id).innerHTML = "0x01";
    
}

