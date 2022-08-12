export class Trace {

    constructor(char, col, line){
        this.trace = {
            start: {
                char: char || 0,
                col: col || 0,
                line: line || 0
            }
        };
        this.trace.end = Object.assign({}, this.trace.start);
    }

    addLine(n){
        this.trace.end.line += n || 1;
    }

    addCol(n){
        this.trace.end.col += n || 1;
    }

    setCol(n){
        this.trace.end.col = n || 0;
    }

    addChar(n){
        this.trace.end.char += n || 1;
    }

    get(name){
        return name ? this.trace[name] : this.trace;
    }

    set(value, name){
        if(name) { this.trace[name] = Object.assign({}, value); }
        else { this.trace = value; }
        // console.log(this.trace);
    }

}