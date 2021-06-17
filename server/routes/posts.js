import express from 'express';

import { getPosts, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/', getPosts);
router.post('/',auth,  createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.put('/:id/likePost', auth, likePost);

export default router;