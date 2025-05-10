import { parseSmartNumber, readCodeArea } from "../funs";
import { Flags, Ram, Registers, StoredObjects } from "../objects";

export class Instruction{

}



type Operand = {
    type: string,
    value: string | number
}



export class SimulatorRunner{
    // as ms 
    speed: number;
    isRunning:boolean = false;
    isPaused:boolean = true;
    flags:Flags= new Flags();
    labels = {};


    rgs:Registers = StoredObjects["registers"];
    ram:Ram = StoredObjects["ram"];
    cache:Cache = StoredObjects["cache1"];

    constructor(speed: number = 100){
        this.speed = speed;

    }

    
    reset(){
        this.flags.reset();
        this.rgs.reset();
        this.ram.reset()
    }

    setReady(program:string[] | undefined){
        
        this.rgs  = StoredObjects["registers"];
        this.ram  = StoredObjects["ram"];
        this.cache = StoredObjects["cache1"];
        console.log(program);
        
        if (program !== undefined){
            let ctr = 0;
            for (let x in program){
                let p = program[x].split(' ');
                if (p[0] === "lbl"){
                    
                    this.labels[p[1]] = ctr
                }
                ctr++;
            }
        };


    }
    stop(){
        this.isRunning = false;
    }

    async run_to_end(){
        const debugArea = document.querySelector("#code-debug-area");
        let lines = readCodeArea();
        
        while(this.isRunning){
            let line = lines[this.rgs.ctr]
            let {timeout,end} = this.tick(line);
            await timeout;
            this.rgs.ctr += 1;
            if (end){
                break;
            }
        }
        this.reset();

    }


    tick(line:string):{timeout:Promise<void>,end:boolean}{
        let end = false;
        
        
            
        if (line === undefined || line === null){
            end = true;
        }else if(line.length === 0){
        }else{
            if (!(line[0] === ';')){
                let parts = line.split(" ");
                switch(parts[0]){
                    case "lbl":
                        this.labels[parts[1]] = this.rgs.ctr;
                        break;
                    case "add":
                    case "sub":
                    case "deref":
                    case "imm":
                    case "cmp" :
                    case "test" :
                    case "mov":{

                        let o1 = this.handleOperand(parts[1]);
                        let o2 = this.handleOperand(parts[2]);

                        this.moveOperands(parts[0],{o1,o2,label:undefined});
                        break;
                    }
                    case "ret" :
                    case "jmp" :
                    case "je"  :
                    case "jne" :
                    case "jgt" :
                    case "jlt" :
                    case "call":
                    case "inc" :
                        let o1 = this.handleOperand(parts[1]);
                        this.moveOperands(parts[0],{o1,o2:undefined,label:parts[1]});
                        break;
                    default:
                        throw new Error("Unknown instruction: " + parts[0]);

                }
                console.log(parts);
            }
            
        }
        this.rgs.ctr += 1;
        
        return {timeout:new Promise(resolve => setTimeout((resolve), this.speed)),end};
}




 handleOperand(op:string):Operand{
    
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
 
 moveOperands(code:string,ops:{o1:Operand,o2:Operand | undefined,label:string|undefined}){
    
    let regs:Registers = this.rgs;
    let ram:Ram = this.ram;
    switch(code){
        case "inc":{
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                regs[r] += 1;
            }else{
                let id = ops.o1.value as number;
                this.setToRam(id, this.getFromRam(id) + 1);
            }
            break;
        }
        case "add":{
            if (ops.o2 === undefined){
                throw new Error("add requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    regs[r] += regs[r2];
                }else{
                    let id = ops.o2.value as number;
                    regs[r] += this.getFromRam(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    this.setToRam(id,this.getFromRam(id)+regs[r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    this.setToRam(id,this.getFromRam(id)+this.getFromRam(id2));
                }
            }
            break;
        }
        case "sub":{
            if (ops.o2 === undefined){
                throw new Error("sub requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    regs[r] -= regs[r2];
                }else{
                    let id = ops.o2.value as number;
                    regs[r] -= this.getFromRam(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    this.setToRam(id,this.getFromRam(id)-regs[r2]);
                }else{
                    let id2 = ops.o2.value as number;
                    this.setToRam(id,this.getFromRam(id)-this.getFromRam(id2));
                }
            }
            break;
        }
        case "mov":{
            if (ops.o2 === undefined){
                throw new Error("mov requires two operands");
            }
            if (ops.o1.type === "register"){
                let r = ops.o1.value as string;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    regs[r] = regs[r2];
                }else{
                    let id = ops.o2.value as number;
                    regs[r] = this.getFromRam(id);
                }
            }else{
                let id = ops.o1.value as number;
                if (ops.o2.type === "register"){
                    let r2 = ops.o2.value as string;
                    this.setToRam(id,regs[r2]);
                }else{
                    let id1 = ops.o1.value as number;
                    let id2 = ops.o2.value as number;
                    console.log("---------------------");
                    console.log("id1:",id1);
                    console.log("id2:",id2);
                    let data = this.ram.getId(id2).content;
                    console.log("data:",data);
                    
                    
                    this.setToRam(id1,this.getFromRam(id2));
                }
            }
            break;
        }
        case "imm":{
            if (ops.o2 === undefined){
                throw new Error("imm requires two operands");
            }
            if (ops.o1.type === "register"){
                let id = ops.o1.value as string;

                let imm = ops.o2.value as number;
                this.rgs[id] = imm;
            }else{
                let id = ops.o1.value as number;                
                
                let imm = ops.o2.value as number;
                
                console.log(imm);
                
                this.setToRam(id,imm);
            }
            break;
        }
        case "deref":{
            if (ops.o2 === undefined){
                throw new Error("deref requires two operands");
            }
            let from = this.getNumFromOperand(ops.o2);
            let to = ops.o1;
            console.log(from);
            let dereferenced = this.getFromRam(from);
            console.log("dereferenced:",dereferenced);
            if (ops.o1.type === "register"){
                let id = ops.o1.value as string;
                this.rgs[id] = dereferenced     ;
            }
            // ram addres
            else{
                let id = ops.o1.value as number;                
                this.setToRam(id,dereferenced)
            }
            
            
            break;
        }
        case "cmp":{
            if (ops.o2 === undefined){
                throw new Error("cmp requires two operands");
            }
            let flags = compareNums(this.getNumFromOperand(ops.o1),this.getNumFromOperand(ops.o2));
            this.flags = flags;
            break;
        }
        case "test":{
            let flags2 = compareNums(this.getNumFromOperand(ops.o1),0);
            flags2.zero = flags2.parity;
            this.flags = flags2;
            console.log(this.flags);

            break;
        }
        case "jmp":{
            
            if (this.labels[ops.label as string] !== undefined){
                this.rgs.ctr = this.labels[ops.label as string]
            }else{                
                let addr = this.getNumFromOperand(ops.o1);
                regs.ctr = addr;
            }
            break;
        }
        case "je":{
            
            if (this.flags.parity){
                if (this.labels[ops.label as string] !== undefined){
                    this.rgs.ctr = this.labels[ops.label as string]    
                }else{
                    let addr = this.getNumFromOperand(ops.o1);
                    regs.ctr = addr;
                }
            }
            break;
        }
        case "jne":{
            if (!this.flags.parity){
                if (this.labels[ops.label as string] !== undefined){
                    this.rgs.ctr = this.labels[ops.label as string]    
                }else{
                    let addr = this.getNumFromOperand(ops.o1);
                    regs.ctr = addr;
                }
            }
            break;
        }
        case "jgt":{
            if (this.flags.bigger){
                if (this.labels[ops.label as string] !== undefined){
                    this.rgs.ctr = this.labels[ops.label as string]    
                }else{
                    let addr = this.getNumFromOperand(ops.o1);
                    regs.ctr = addr;
                }
            }
            break;
        }
        case "jlt":{
            if (this.flags.smaller){
                if (this.labels[ops.label as string] !== undefined){
                    this.rgs.ctr = this.labels[ops.label as string]    
                }else{
                    let addr = this.getNumFromOperand(ops.o1);
                    regs.ctr = addr;
                }
            }
            break;
        }
        case "call":{
            let addr:number;
            if (this.labels[ops.label as string] !== undefined){
                addr = this.labels[ops.label as string]
            }else{
                addr = this.getNumFromOperand(ops.o1);
            }
            

            // the ctr will auto increases by every tick
            this.setToRam(regs.rsp,regs.ctr);
            regs.ctr = addr;
            regs.rsp += 1;
            break;
        }
        case "ret":{
            let addr = this.getFromRam(regs.rsp);
            console.log(addr);
            regs.ctr = addr; 
            regs.rsp -= 1;
            break;
        }
    }
}

 getFromRam(id:number):number{
    let val = this.ram.getId(id).content;    
    
    return parseSmartNumber(val);
}

 setToRam(id:number,val:number):number{
    
    this.ram.setId(id,val);
    return parseSmartNumber(val);
}

 getNumFromOperand(op:Operand):number{
    if (op.type === "register"){
        let r = op.value as string;
        return this.rgs[r];
    }else{
        let id = op.value as number;
        return this.getFromRam(id);
    }
}
}
function compareNums(n1:number,n2:number):Flags{
    let flags = new Flags();
    if (n1 > n2){
        flags.bigger = true;
    }else if (n1 < n2){
        flags.smaller = true;
    }else{
        flags.parity = true;
    }
    return flags;
}


export enum InstructionType {
    INC = 'inc',    //
    IMM = 'imm',    //
    ADD = 'add',    //
    SUB = 'sub',    //
    DEREF = 'deref',//
    MOV = 'mov',    //
    CMP = 'cmp',
    TEST = 'test',
    JMP = 'jmp',
    JNE = 'jne',
    JEQ = 'jeq',
    JGT = 'jgt',
    JLT = 'jlt',
    CALL = 'call',
    RET = 'ret',
}