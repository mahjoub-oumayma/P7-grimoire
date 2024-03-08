const express= require ('express');
const router = express.Router();
const bookControllers = require('../controllers/book');
const auth = require('../middelware/auth');
const multer = require('../middelware/Upload');




router.get('/bestrating', bookControllers.ByBestRating);
router.get('/:id', bookControllers.getBookById);
router.get('/', bookControllers.getBooks);
router.put('/:id', auth, multer ,bookControllers.putBooksById);

router.post('/:id/rating', auth ,bookControllers.ByIdRating);

router.post('/', auth, multer, bookControllers.postBooksImg);
router.delete('/:id', auth ,bookControllers.deleteBooksById);
module.exports=router;