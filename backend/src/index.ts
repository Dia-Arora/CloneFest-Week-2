import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const db = new PrismaClient();
const PORT = process.env.PORT || 3000;
// Make sure JWT_SECRET is set in your Render environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key_for_development';

// --- MIDDLEWARE SETUP ---

app.use(cors());
app.use(express.json());
// Serve static files (like uploaded images) from the 'storage' directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// --- FILE UPLOAD SETUP (Multer) ---

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/images'); // This folder is created in your Dockerfile
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// --- AUTHENTICATION MIDDLEWARE ---

// Extend Express's Request type to include the user payload from the JWT
interface AuthRequest extends Request {
  user?: { userId: number };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' }); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid' }); // Forbidden
    }
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// POST /api/signup - Create a new user
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({ data: { username, password: hashedPassword } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists or invalid data provided.' });
  }
});

// POST /api/login - Log in a user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.user.findUnique({ where: { username } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// POST /api/upload - Upload an image (protected route)
app.post('/api/upload', authenticateToken, upload.single('image'), async (req: AuthRequest, res: Response) => {
  const { caption, tags } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  // Use a default album or create it if it doesn't exist
  const album = await db.album.upsert({
    where: { name: 'Default Album' },
    update: {},
    create: { name: 'Default Album' },
  });

  const newImage = await db.image.create({
    data: {
      url: `/storage/images/${file.filename}`,
      caption,
      tags, // FIX: The 'tags' property is now correctly handled
      albumId: album.id,
    },
  });

  res.status(201).json(newImage);
});

// GET /api/images - Get all images, with optional filtering by tag
app.get('/api/images', async (req, res) => {
  const { tag } = req.query;

  const whereClause = tag
    ? { tags: { contains: tag as string } } // FIX: 'tags' is now a valid property to filter by
    : {};

  const images = await db.image.findMany({ 
    where: whereClause,
    orderBy: { createdAt: 'desc' } 
  });
  res.json(images);
});

// GET /api/images/:id - Get a single image by its ID
app.get('/api/images/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // FIX: Convert the string parameter from the URL to a number

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format. ID must be a number.' });
  }

  const image = await db.image.findUnique({ where: { id } });

  if (image) {
    res.json(image);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});


// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});