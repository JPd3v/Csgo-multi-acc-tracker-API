import express from 'express';
import * as dropsController from '../controllers/dropsController';

const router = express.Router();

router.get('/:steamAccountId', dropsController.getDrops);
router.post('/', dropsController.newDrop);
router.put('/:dropId', dropsController.editDrop);
router.delete('/:dropId', dropsController.deleteDrop);

export default router;
