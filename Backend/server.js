import express from 'express';
import cors from 'cors';
import {conforcatController} from './src/controllers/index.js'
import multer from 'multer' 

const whiteList = ['http://172.31.255.29:5000', 'http://localhost:5173']

const storage = multer.memoryStorage(); // Almacena los archivos en memoria
const upload = multer({ storage });
const app = express();
const port = 3000;

app.use(cors({
  origin: whiteList
}));

// app.get('/', (req, res) => {
//   res.send('Hola, Mundo!');
// });

app.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { textUrl: url } = req.body;
  const { accesTipe } = req.body;
  const result = await conforcatController(url, file, accesTipe);
  //console.log(result);
  if (result !== 'OK')
    res.status(500).json({ message: result });
  else
    res.status(200).json({ message: result });
});

app.listen(port, '192.168.1.170', () => {
  console.log(`Servidor escuchando en http://192.168.1.170:${port}`);
});