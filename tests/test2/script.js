import { sdom } from "../../lib/sdom.js";

let code = document.querySelector('pre').textContent;
        
sdom.transpile(code)