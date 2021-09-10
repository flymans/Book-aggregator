import { Router } from 'express';

import * as bookControllers from '../controllers/books';

const router = new Router();

router.get('/books', bookControllers.getBooks);
router.get('/authors', bookControllers.getAuthors);
router.get('/publishers', bookControllers.getPublishers);
router.post('/savebstore', bookControllers.saveBStore);
router.post('/savebook24', bookControllers.saveBook24);
router.post('/savecombook', bookControllers.saveComBook);

export default router;
