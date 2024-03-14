const { text } = require('express');
const Book = require('../models/book');
const fs = require('fs');


// Récupérer tous les livres
exports.getBooks = async (req, res, next) => {
    try {
      const books = await Book.find();
  
      if (books.length > 0) {
        res.status(200).json(books);
      } else {
        res.status(200).json({ message: 'No books available' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

 // Récupérer un livre par id 
exports.getBookById = (req, res, next) => {
  Book.findById(  req.params.id )
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error }));
};

// GET => Récupération des 3 livres les mieux notés
exports.ByBestRating = (req, res, next) => {
  // Récupération de tous les livres
  // Puis tri par rapport aux moyennes dans l'ordre décroissant, limitation du tableau aux 3 premiers éléments
  Book.find().sort({averageRating: -1}).limit(3)
      .then((books)=>res.status(200).json(books))
      .catch((error)=>res.status(404).json({ error }));
};


// Création d'un livre
exports.postBooksImg = (req, res, next) => {
  const { title, author, year, genre, ratings, averageRating } = JSON.parse(req.body.book);
  const userId = req.auth.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  const book = new Book({
    title,
    author,
    year,
    genre,
    ratings,
    averageRating,
    imageUrl,
    userId
  });
    
    // Enregistrement dans la base de données
    book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json( { error }) })
};





// Modification d'un livre
exports.putBooksById = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body };
    // Récupération du livre existant à modifier
    Book.findOne({_id: req.params.id})
    .then((book) => {
        // Le livre ne peut être mis à jour que par le créateur de sa fiche
        if (book.userId != req.auth.userId) {
            res.status(403).json({ message : '403: unauthorized request' });
        } else {
            // Récupération du nom du fichier image existant
            const filename = book.imageUrl.split('/images/')[1];
            // Appel à la fonction de suppression de l'image
            if(req.file) supprimeImage(`images/${filename}`)
            // Mise à jour du livre
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(404).json({ error });
    });
};



// Suppression d'un livre //
exports.deleteBooksById = (req, res, next) => {
    // Récupération du livre à supprimer
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        // Le livre ne peut être supprimé que par le créateur de sa fiche
        if (book.userId != req.auth.userId) {
            res.status(403).json({ message: '403: unauthorized request' });
        } else {
            // Récupération du nom du fichier image existant
            const filename = book.imageUrl.split('/images/')[1];
            // Suppression du fichier image
            supprimeImage(`images/${filename}`)
            // Suppression du livre dans la base de données
            Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(400).json({ error }));
        }
   })
   .catch( error => {
       res.status(404).json({ error });
   });
};



// Noter un livre
exports.ByIdRating = (req, res, next) => {
    const { id } = req.params;
    const { userId, rating} = req.body;

    Book.findById(id)
    .then(book => {
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        // On vérifie si l'utilisater a déjà mis une note
        for (let i = 0; i < book.ratings.length; i++) {
            if (book.ratings[i].userId === userId) {
                return res.status(400).json({ message: 'L utilisateur a déjà noté ce livre' });
            }
        }
        // On ajoute la note dans le tableau des notes du livre
        book.ratings.push({
            userId : userId, 
            grade : rating
        });
        // On calcue la nouvelle moyenne de notes
        let sum = 0;
        for (let i = 0; i < book.ratings.length; i++) 
        {
            sum += book.ratings[i].grade;
        }
        averageRating = sum / book.ratings.length;
        book.averageRating = parseInt(averageRating);
        // On met à jour les notes et la moyenne du livre
        return  Book.updateOne({ _id: req.params.id }, { ratings:book.ratings, averageRating:book.averageRating })
    .then(data=> {
        if(data){
        res.status(201).json(book)
        }
    })
    .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ message:'il y a eu une erreur' }));
};

// Fonction de suppression de l'image
const supprimeImage = (imagePath) => {
    try {
        fs.unlinkSync(imagePath);
        return true
    } catch (error) {
        console.error("Erreur de suppression de l'image", error);
        return false
    }
};