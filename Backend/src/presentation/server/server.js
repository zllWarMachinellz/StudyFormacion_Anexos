import express from 'express';


export class Server{
    app = express();
    ports={};
    /**
     * 
     * @param {Object} options 
     */
    constructor(options){
        const {port=3001} = options
        this.port = port;
    }

    async start(){
        this.app.listen(this.port, () =>{
            console.log(`Server running on port ${this.port}`)
        })
    }

}
