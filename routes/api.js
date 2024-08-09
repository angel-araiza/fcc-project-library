/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI);

  const librarySchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: {type: [String]},
    commentcount: {type: Number, default: 0}
  });

  const Library = mongoose.model('Library', librarySchema);

  app.route('/api/books')
    .get(async (req, res) =>{
      try{
        const doc = await Library.find();
        res.json( doc);
      } catch (err){
        res.status(500).json({error: "can't find library."})
      }

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res) =>{
      let title = req.body.title;

      try{
        if (!title) return res.status(400).json({error: "missing required field title"})

        const newBook = new Library({
          title
        });
        await newBook.save();
        res.json({
          _id:newBook._id,
          title: newBook.title
        });
      } catch (err) {
        res.status(500).json({error: "There was an error saving the new book"})
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) =>{
      //if successful response will be 'complete delete successful'

      try{
        await Library.deleteMany();
        res.json({error:'complete delete successful'})

      } catch(err){
        res.status(400).json({error: "could not delete"})
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) =>{
      let bookid = req.params.id;
      const doc = await Library.findById(bookid);

        if (!doc) {
          return res.status(404).json({ error: 'no book exists' });
        }
      try{

        res.json({
          _id: doc.bookid,
          title: doc.title,
          comments: doc.comments
        })
      } catch (err){
        res.status(500).json({error: "server error"})
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async(req, res) =>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) return res.status(500).json({ error: "missing required field comment"});
      const doc = await Library.findOneAndUpdate(
        {_id: bookid},
        {$push:{comments:comment}, $inc: {commentcount:1}},
        {new:true}
      );

      if (!doc) return res.status(400).json({error: "book not found"});

      try{
        
        
        res.json({
          _id: doc.bookid,
          title: doc.title,
          comments: doc.comments
        })
      } catch (err){
        res.status(500).json({error: "server error"})
      }
    })
    
    .delete(async(req, res) =>{
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      try {
        if (!bookid) return res.status(400).json({error: "could not find book"});

        await Library.deleteOne({_id: bookid});
        res.json({result: "delete successful"});
      } catch (err) {
        res.status(400).json({error: "no book exists"})
      }

    });
  
};
