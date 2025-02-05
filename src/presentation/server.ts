import express, { Router } from "express";
import path from "path";
import compression from "compression";
import { ErrorMiddleware } from "./middlewares/error.middleware";

interface Options {
    port: number;
    routes: Router;
    publicPath?: string;
}

export class Server {
    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, publicPath, routes } = options;
        this.port = port;
        this.publicPath = publicPath ?? 'public';
        this.routes = routes;
    }

    async start() {
        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); //x-www-form-urlencoded
        this.app.use(compression());

        //* Public folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        this.app.use(ErrorMiddleware.middleware)

        //* SPA
        this.app.get("*", (_req, res) => {
            const indexPath = path.join(
                __dirname,
                `../../${this.publicPath}/index.html`,
            );
            res.sendFile(indexPath);
        });

        this.serverListener = this.app.listen(
            this.port,
            () => console.log(`Server running on port ${this.port}`),
        );

    }
    
    public close() {
        this.serverListener.close();
    }
}
