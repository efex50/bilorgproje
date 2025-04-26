import { setRamField } from "./ram";
import { Table } from "./objects";

export function main() {
    console.log("Main function started");
    let cachleL = new Table(16,16,"cache","cache-div");    
    cachleL.init();
    cachleL.render();
    cachleL.set(0, 0, 0x01);

    let id = cachleL.cellIdGen(40);
    console.log(id);
    document.getElementById(id).innerHTML = "0x01";
    
}

