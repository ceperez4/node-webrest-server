import express from 'express'
import path from 'path';

interface Options {
    PORT: number,
    PUBLIC_PATH?: string
}
export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor(options: Options){
        const {PORT, PUBLIC_PATH = 'public'} = options;
        this.port = PORT;
        this.publicPath = PUBLIC_PATH;
    }

    async start() {
        //middlewares


        //public folder
        this.app.use(express.static(this.publicPath));

        this.app.use((req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`)

            res.sendFile(indexPath);

        })

        this.app.listen(this.port, () => {

            console.log(`Server running on port ${this.port}`)
        })
    }
}