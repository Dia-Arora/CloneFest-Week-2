import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import prisma from './db';

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Extend Express Request type to include user
interface AuthRequest extends express.Request {
  user?: any;
}

// Auth middleware
const authenticateJWT = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'CloneFest2025' && password === 'CloneFest2025') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/upload', authenticateJWT, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fileUrl = `${BASE_URL}/storage/images/${req.file.filename}`;
  const tags = req.file.originalname.split('.')[0].split(/[\s-_]+/).map(tag => tag.toLowerCase());
  const albumName = tags[0] || 'Uncategorized';

  // Simulate AI vector generation
  const vector = Array.from({ length: 10 }, () => Math.random());

  try {
    const album = await prisma.album.upsert({
      where: { name: albumName },
      update: {},
      create: { name: albumName },
    });

    const image = await prisma.image.create({
      data: {
        url: fileUrl,
        tags: tags,
        albumId: album.id,
        vector: vector,
      },
    });
    res.status(201).json({ url: image.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving image to database.' });
  }
});

// Get all albums
app.get('/api/albums', authenticateJWT, async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        _count: {
          select: { images: true },
        },
      },
    });
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching albums.' });
  }
});

// Get a single album with its images
app.get('/api/albums/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: { images: true },
    });
    if (album) {
      res.json(album);
    } else {
      res.status(404).json({ message: 'Album not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching album.' });
  }
});

// Search for images
app.get('/api/search', authenticateJWT, async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  const searchQuery = q.toString().toLowerCase();

  try {
    // In a real application, you would use the search query to generate a vector
    // and then perform a similarity search in the database.
    // For this simulation, we will perform a simple keyword search on the tags.
    const images = await prisma.image.findMany({
      where: {
        tags: {
          has: searchQuery,
        },
      },
    });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for images.' });
  }
});

app.use('/storage', express.static('storage'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
