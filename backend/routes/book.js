const express= require ('express');
const router = express.Router();
const bookControllers = require('../controllers/book');
const auth = require('../middelware/auth');
const multer = require('../middelware/Upload');




router.get('/:id', bookControllers.getBookById);
router.get('/', bookControllers.getBooks);
router.get('/bestrating', bookControllers.ByBestRating);
router.put('/:id', bookControllers.putBooksById);
router.delete('/:id', bookControllers.deleteBooksById);
router.post('/:id/rating', bookControllers.ByIdRating);

router.post('/', auth, multer, bookControllers.postBooksImg);
module.exports=router;