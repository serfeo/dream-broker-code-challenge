const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', function(req, res) {
  const text = req.body.text ? req.body.text : "";

  res.send({
    "textLength": getTextLength(text),
    "wordCount": getWordCount(text),
    "characterCount": getCharacterCount(text)
  });
});

function getTextLength(text) {
  return {
    "withSpaces": text.length,
    "withoutSpaces": text.replace(/ /g, "").length
  };
}

function getWordCount(text) {
  const parts = text.trim().split(" ");

  let count = 0;
  parts.forEach(word => {
    if (word.match(/\w+/)) {
      count++
    }
  });

  return count;
}

function getCharacterCount(text) {
  let charactersCountMap = getCharactersCountMap(text)
  let result = getSortedCharactersCountArray(charactersCountMap);

  return result;
}

function getSortedCharactersCountArray(charactersCountMap) {
  let array = []
  Object.keys(charactersCountMap).sort().forEach(key => {
    array.push({[key]: charactersCountMap[key]})
  });

  return array;
}

function getCharactersCountMap(text) {
  let charactersCountMap = {}

  Array.from(text).forEach(character => {
    if (character.match(/[A-Za-z]+/)) {
      if (!charactersCountMap[character]) {
        charactersCountMap[character] = 0;
      }

      charactersCountMap[character]++;
    }
  });

  return charactersCountMap;
}

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
