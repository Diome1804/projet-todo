import 'dotenv/config';
import express from "express";
import path from "node:path";
import TaskRoute from "./routes/TaskRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import HistoryRoute from "./routes/HistoryRoute.js";
import cors from "cors";

const app = express();
const lex_port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Configuration CORS pour le développement local
const corsOptions: cors.CorsOptions = {
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://localhost:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5176'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    credentials: true, // Important pour les cookies et l'authentification
    optionsSuccessStatus: 200
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de debug pour les requêtes CORS
app.use((req, _res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
    console.log(`🔑 Authorization: ${req.headers.authorization ? 'présent' : 'absent'}`);
    next();
});

// Appliquer CORS
app.use(cors(corsOptions));

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', AuthRoute);
app.use('/task', TaskRoute);
app.use('/history', HistoryRoute);

app.listen(lex_port, () => {
    console.log('le server est demarre sur le port ' + lex_port);
});