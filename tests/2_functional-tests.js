/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .keepOpen()
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: "dog frog"
          })
          .end(function(err, res){
            if (err) return done (err);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "dog frog");
            assert.exists(res.body._id, "id exists")
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .end(function (err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "missing required field title")
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res){
            assert.equal(res.status, 200)
            assert.isArray(res.body, "Response should be an aray of books")
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/66b545aa0e7cee6aef45fbf0')
          .end(function (err, res){
            assert.equal(res.status, 404);
            assert.equal(res.body.error, "no book exists")
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/66b6207311a9f1f607081db1')
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "dog frog")
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/66b6207311a9f1f607081db1')
          .send({
            comment: "it is about a dog, and frog."
          })
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], "it is about a dog, and frog.")
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/66b6207311a9f1f607081db1')
          .end(function (err, res){
            assert.equal(res.status, 500);
            assert.equal(res.body.error, "missing required field comment")
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/66b545aa0e7cee6aef45fbf0')
          .send({
            comment: "fake news"
          })
          .end(function (err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "book not found")
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/66b545aa0e7cee6aef45fbf2')
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "delete successful")
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/1234')
          .end(function (err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "no book exists")
            done();
          })
      });

    });

  });

});
