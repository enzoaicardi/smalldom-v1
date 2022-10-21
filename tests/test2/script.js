import { sdom } from "../../lib/sdom.js";

let code = document.querySelector('pre').textContent;
        
let html = sdom.transpile(code)
console.log(html)