"use strict";

const chai = require("chai");
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();

const app = require("../app.js");

describe("Tests app", function() {
  it("verifies post", function(done) {
    commonPostRequest({"text": ""}, function(err, res) {
      res.should.have.status(200);
      res.should.have.header("content-type", "application/json; charset=utf-8");

      done(err);
    });
  });

  it("verifies result object format", function(done) {
    commonPostRequest({"text": "t"}, function(err, res) {
      res.should.have.status(200);

      res.body.should.have.property("textLength");
      res.body.textLength.should.be.a("object");

      res.body.textLength.should.have.property("withSpaces");
      res.body.textLength.withSpaces.should.be.a("number");

      res.body.textLength.should.have.property("withoutSpaces");
      res.body.textLength.withoutSpaces.should.be.a("number");

      res.body.should.have.property("wordCount");
      res.body.wordCount.should.be.a("number");

      res.body.should.have.property("characterCount").with.lengthOf(1);
      res.body.characterCount.should.be.a("array");
      res.body.characterCount[0].should.eql({"t": 1});

      done(err);
    });
  });

  it("check empty text string", function(done) {
    commonPostRequest({"text": ""}, function(err, res) {
      resultObjectCheck(res, 0, 0, 0, []);
      done(err);
    });
  });

  it("check text string with space only", function(done) {
    commonPostRequest({"text": " "}, function(err, res) {
      resultObjectCheck(res, 1, 0, 0, []);
      done(err);
    });
  });

  it("check text string with 2 spaces only", function(done) {
    commonPostRequest({"text": "  "}, function(err, res) {
      resultObjectCheck(res, 2, 0, 0, []);
      done(err);
    });
  });

  it("check text string with 1 simple word", function(done) {
    commonPostRequest({"text": "test"}, function(err, res) {
      resultObjectCheck(res, 4, 4, 1, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word and 1 trailing space", function(done) {
    commonPostRequest({"text": "test "}, function(err, res) {
      resultObjectCheck(res, 5, 4, 1, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word and 2 trailing spaces", function(done) {
    commonPostRequest({"text": "test  "}, function(err, res) {
      resultObjectCheck(res, 6, 4, 1, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word and 1 leading space", function(done) {
    commonPostRequest({"text": " test"}, function(err, res) {
      resultObjectCheck(res, 5, 4, 1, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word and 2 leading spaces", function(done) {
    commonPostRequest({"text": "  test"}, function(err, res) {
      resultObjectCheck(res, 6, 4, 1, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 2 simple words and 1 space between them", function(done) {
    commonPostRequest({"text": "test test"}, function(err, res) {
      resultObjectCheck(res, 9, 8, 2, [{"e": 2}, {"s": 2}, {"t": 4}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 2 simple words and 2 spaces between them", function(done) {
    commonPostRequest({"text": "test  test"}, function(err, res) {
      resultObjectCheck(res, 10, 8, 2, [{"e": 2}, {"s": 2}, {"t": 4}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word and 1 digit word", function(done) {
    commonPostRequest({"text": "test 123"}, function(err, res) {
      resultObjectCheck(res, 8, 7, 2, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with 1 simple word, 1 digit word, 1 special symbol", function(done) {
    commonPostRequest({"text": "test 123 _"}, function(err, res) {
      resultObjectCheck(res, 10, 8, 3, [{"e": 1}, {"s": 1}, {"t": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with non word symbol", function(done) {
    commonPostRequest({"text": "."}, function(err, res) {
      resultObjectCheck(res, 1, 1, 0, []);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with upper and lower cased words", function(done) {
    commonPostRequest({"text": "A a"}, function(err, res) {
      resultObjectCheck(res, 3, 2, 2, [{"a": 2}]);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check text string with non english word", function(done) {
    commonPostRequest({"text": "тест"}, function(err, res) {
      resultObjectCheck(res, 4, 4, 0, []);
      res.should.have.status(200);
      done(err);
    });
  });

  it("check prepared in challenge text string", function(done) {
    commonPostRequest({"text": "hello 2 times  "}, function(err, res) {
      resultObjectCheck(res, 15, 11, 3, [{"e":2},{"h":1},{"i":1},{"l":2},{"m":1},{"o":1},{"s":1},{"t":1}]);
      res.should.have.status(200);
      done(err);
    });
  });

});

function commonPostRequest(params, callback) {
  chai.request(app).post("/").send(params).end(callback);
}

function resultObjectCheck(res, lengthWithSpaces, lengthWithoutSpaces, wordsCount, charactersArray) {
  res.should.have.status(200);

  res.body.textLength.withSpaces.should.eql(lengthWithSpaces);
  res.body.textLength.withoutSpaces.should.eql(lengthWithoutSpaces);

  res.body.wordCount.should.eql(wordsCount);

  res.body.characterCount.should.eql(charactersArray);
}