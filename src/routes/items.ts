import express from 'express';
import * as itemsController from '../controllers/itemsController';

const router = express.Router();

router.get('/', itemsController.getItems);
router.put('/cases', itemsController.updateCases);

export default router;
