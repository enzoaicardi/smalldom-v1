
/**
 * Représente une trace de pile
 * @constructor
 */

    export class Trace{

        constructor(){

            this.start = {
                char: 0,
                col: 0,
                line: 0
            }

            this.end = {
                char: 0,
                col: 0,
                line: 0
            }

        }

        // global

        startFrom(trace){
            if(trace) {
                Object.assign(this.start, trace.end)
                this.endBy(trace)
            }
            return this
        }

        startBy(trace){
            if(trace) Object.assign(this.start, trace.start)
            return this
        }

        endBy(trace){
            if(trace) Object.assign(this.end, trace.end)
            return this
        }

        bounds(trace1, trace2){
            this.startBy(trace1)
            this.endBy(trace2 || trace1)
            return this
        }

        // controls

        addChar(n){
            this.end.char += n || 1;
        }

        addCol(n){
            this.end.col += n || 1;
        }

        push(n){
            this.addChar(n);
            this.addCol(n);
        }

        // ---

        addLine(n){
            this.end.line += n || 1;
        }

        setCol(n){
            this.end.col = n || 0;
        }

        break(){
            this.addLine();
            this.setCol();
        }

    }

//