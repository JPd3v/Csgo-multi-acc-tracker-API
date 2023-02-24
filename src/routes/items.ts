import express from 'express';
import * as itemsController from '../controllers/itemsController';

const router = express.Router();

router.get('/', itemsController.getItems);

export default router;
