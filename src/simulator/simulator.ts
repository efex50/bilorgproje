import { parseSmartNumber, readCodeArea } from "../funs";
import { Flags, Registers, StoredObjects } from "../objects";

export class Instruction{

}
export class SimulatorRunner{
    // as ms 
    speed: number;
    isRunning:boolean = false;
    flags:Flags= new Flags();

    constructor(speed: number = 100){
        this.speed = speed;

    }

    stop(){
        this.isRunning = false;
    }

    async run_to_end(){
        const debugArea = document.querySelector("#code-debug-area");
        let lines = readCodeArea();
        let rgs = StoredObjects["registers"];
        let ram = StoredObjects["ram"];
        let Cache = StoredObjects["cache1"];
        let labels = {};




        function innerTick(line: string){
            let end = false;
            
            
            if (line === undefined || line === null){
                end = true;
            }else{
                let parts = line.split(" ");
                switch(parts[0]){
                    
                    case "add":
                    case "sub":
                    case "deref":
                    case "mov":{

                        let o1 = handleOperand(parts[1]);
                        let o2 = handleOperand(parts[2]);
                        moveOperands(parts[0],{o1,o2});
                        break;
                    }
                    case "ret":
                    case "cmp":
                    case "jmp":
                    case "jne":
                    case "jeq":
                    case "jgt":
                    case "jlt":
                    case "call":
                    case "inc":
                        let o1 = handleOperand(parts[1]);
                        moveOperands(parts[0],{o1,o2:undefined});
                        break;
                    
                }
                console.log(parts);
                
            }
            
            
            return [new Promise(resolve => setTimeout((resolve), this.speed)),end];
        }
        

        
        while(this.isRunning){
            let line = lines[rgs.ctr]
            let [_,end] = await innerTick(line);
            rgs.ctr += 1;
            if (end){
                break;
            }
        }
        this.reset();

    }

    reset(){
        StoredObjects["registers"].reset();
    }

    tick(){
        let r:Registers = StoredObjects["registers"];
    }
}
export let SimulatorProgram:Instruction[] = [];


type Operand = {
    type: string,
    value: string | number
}


function handleOperand(op:string):Operand{
    switch(op){
        case "r0":
        case "r1":
        case "r2":
        case "r3":
        case "r4":
        case "r5":
        case "r6":
        case "r7":
        case "r8":
        case "r9":
        case "rsp":
        case "ctr":
        case "rbp":
            return {type:"register", value:op};
        default:
            let id = parseSmartNumber(op);
            return {type:"ram", value:id};
    }

}
 
function moveOperands(code:string,ops:{o1:Operand,o2:Operand | undefined}){
    switch(code){
        case "inc":
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                StoredObjects["registers"][r] += 1;
            }else{
                let id = ops.o1.value as number;
                StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id)+1);
            }
            break;
        case "add":
            if (ops.o2 === undefined){
                throw new Error("add requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["registers"][r] += StoredObjects["registers"][r2];
                }else{
                    let id = ops.o2.value as number;
                    StoredObjects["registers"][r] += StoredObjects["ram"].getId(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id)+StoredObjects["registers"][r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id)+StoredObjects["ram"].getId(id2));
                }
            }
            break;
        case "sub":
            if (ops.o2 === undefined){
                throw new Error("sub requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["registers"][r] -= StoredObjects["registers"][r2];
                }else{
                    let id = ops.o2.value as number;
                    StoredObjects["registers"][r] -= StoredObjects["ram"].getId(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id)-StoredObjects["registers"][r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id)-StoredObjects["ram"].getId(id2));
                }
            }
            break;
        case "mov":
            if (ops.o2 === undefined){
                throw new Error("mov requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["registers"][r] = StoredObjects["registers"][r2];
                }else{
                    let id = ops.o2.value as number;
                    StoredObjects["registers"][r] = StoredObjects["ram"].getId(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["ram"].setId(id,StoredObjects["registers"][r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id2));
                }
            }
            break;
        case "deref":
            if (ops.o2 === undefined){
                throw new Error("deref requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["registers"][r] = StoredObjects["ram"].getId(StoredObjects["registers"][r2]);
                }else{
                    let id = ops.o2.value as number;
                    StoredObjects["registers"][r] = StoredObjects["ram"].getId(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["ram"].setId(id,StoredObjects["registers"][r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    StoredObjects["ram"].setId(id,StoredObjects["ram"].getId(id2));
                }
            }
            break;
        case "cmp":
            if (ops.o2 === undefined){
                throw new Error("cmp requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["flags"].setFlag(StoredObjects["registers"][r] - StoredObjects["registers"][r2]);
                }else{
                    let id = ops.o2.value as number;
                    StoredObjects["flags"].setFlag(StoredObjects["registers"][r] - StoredObjects["ram"].getId(id));
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    StoredObjects["flags"].setFlag(StoredObjects["ram"].getId(id) - StoredObjects["registers"][r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    StoredObjects["flags"].setFlag(StoredObjects["ram"].getId(id) - StoredObjects["ram"].getId(id2));
                }
            }
            break;
    }
}

export enum InstructionType {
    INC = 'inc',//
    ADD = 'add',//
    SUB = 'sub',//
    DEREF = 'deref',//
    MOV = 'mov',//
    CMP = 'cmp',
    JMP = 'jmp',
    JNE = 'jne',
    JEQ = 'jeq',
    JGT = 'jgt',
    JLT = 'jlt',
    CALL = 'call',
    RET = 'ret',
}