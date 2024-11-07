import express from 'express';
import ontologyRoutes from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', ontologyRoutes);

app.listen(PORT, () => {
  console.log(`Ontology service running on http://localhost:${PORT}`);
});
