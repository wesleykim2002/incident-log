import express, {Request, Response} from 'express';
import { sequelize } from './config/db';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth';
import incidentsRoute from './routes/incidents';

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('API is running!')
})

app.get('/private', authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.uid}, you're authenticated!` });
});

app.use('/incidents', incidentsRoute);

sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
});
