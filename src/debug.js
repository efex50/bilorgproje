import { Debug } from "./main";

export function dbg(msg) {
    if (Debug) {
        console.log(msg);
    }
}

