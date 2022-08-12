
class SdomErrors {
    constructor(message){
        this.msg = message;
    }
}

export class TokenError extends SdomErrors {

    constructor(message){
        super(message);

    }
    
}