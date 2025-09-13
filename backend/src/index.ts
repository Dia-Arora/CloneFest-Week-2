import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
// import fs from 'fs'; 

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
    cb(null, 'storage/images'); // This folder is created in your Dockerfile & mapped to a disk
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
  // Use 'any' for the user payload or define a specific JwtPayload interface
  user?: { userId: number } | any;
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

// Root route for Render.com health checks
app.get('/', (req, res) => {
  res.status(200).send('Server is healthy and running!');
});


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

// This is your hardcoded login route (as you requested)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'CloneFest2025' && password === 'CloneFest2025') {
    // Note: This token is not associated with a database user ID.
    // This will cause problems with the delete/upload logic unless you sign a real ID.
    const token = jwt.sign({ username: 'CloneFest2025' /*, userId: 1 */ }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- UPDATED UPLOAD ROUTE ---
app.post('/api/upload', authenticateToken, upload.single('image'), async (req: AuthRequest, res: Response) => {
  const { caption, tags } = req.body;
  const file = req.file;

  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated or user ID is missing from token.' });
  }

  if (!file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const album = await db.album.upsert({
    where: { name: 'Default Album' },
    update: {},
    create: { name: 'Default Album' },
  });

  const newImage = await db.image.create({
    data: {
      url: `/storage/images/${file.filename}`,
      caption,
      tags, 
      albumId: album.id,
      ownerId: userId
    },
  });

  res.status(201).json(newImage);
});

// --- FIXED 'GET ALL IMAGES' ROUTE ---
app.get('/api/images', async (req, res) => {
  const { tag } = req.query;

  // --- THIS IS THE FIX ---
  // For a String array, the Prisma filter is 'has', not 'contains'
  const whereClause = tag
    ? { tags: { has: tag as string } } 
    : {};
  // --- END OF FIX ---

  const images = await db.image.findMany({ 
    where: whereClause,
    orderBy: { createdAt: 'desc' } 
  });
  res.json(images);
});


// --- FIXED 'GET BY ID' ROUTE ---
app.get('/api/images/:id', async (req, res) => {
  const { id } = req.params; // This is a CUID string

  const image = await db.image.findUnique({ where: { id } });

  if (image) {
    res.json(image);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// --- NEW DELETE ROUTE ---
app.delete('/api/images/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // The image CUID
    const userId = req.user?.userId; // The user ID from the token

    if (!userId) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }

    const image = await db.image.findUnique({
      where: { id: id },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.ownerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this image' });
    }

    // TODO: Delete the actual file from your persistent disk using fs.unlinkSync()

    await db.image.delete({
      where: { id: id },
    });
    
    res.status(200).json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the image.' });
  }
});


// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});