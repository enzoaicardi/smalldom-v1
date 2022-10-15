import { sdom } from "../../lib/sdom.js";

let code = document.querySelector('p').textContent;
        
sdom.transpile(code)