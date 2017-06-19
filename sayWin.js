var translit = require('translitit-cyrillic-russian-to-latin');
const utf8 = require('utf8');
var Shell = require('node-powershell');
var transliterate = function(word) {
  var a = { "Ё": "YO", "Ц": "TS", "У": "U", "К": "K", "Е": "E", "Н": "N", "Г": "G", "Ш": "SH", "Щ": "SCH", "З": "Z", "Х": "H", "Ъ": "'", "ё": "yo", "ц": "ts", "у": "u", "к": "k", "е": "e", "н": "n", "г": "g", "ш": "sh", "щ": "sch", "з": "z", "х": "h", "ъ": "'", "Ф": "F", "Ы": "I", "В": "V", "А": "a", "П": "P", "Р": "R", "О": "O", "Л": "L", "Д": "D", "Ж": "ZH", "Э": "E", "ф": "f", "ы": "i", "в": "v", "а": "a", "п": "p", "р": "r", "о": "o", "л": "l", "д": "d", "ж": "zh", "э": "e", "Я": "Ya", "Ч": "CH", "С": "S", "М": "M", "И": "yi", "Т": "T", "Ь": "'", "Б": "B", "Ю": "YU", "я": "ya", "ч": "ch", "с": "s", "м": "m", "и": "yi", "т": "t", "ь": "'", "б": "b", "ю": "yu", "й": "i" };
  return word.split('').map(function(char) {
    return a[char] || char;
  }).join("");
}

var sayWin = (text) => {

  text = /[а-яА-ЯЁё]/.test(text) ? transliterate(text) : text;

  var shell = new Shell({
    inputEncoding: 'binary'
  });
  shell.addCommand('Add-Type -AssemblyName System.speech');
  shell.addCommand('$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer');
  shell.addCommand('$speak.Speak("' + text.replace(/"/g,"'") + '")');
  shell.on('output', data => {
    console.log("data", data);
  });
  shell.on('err', err => {
    console.log("err", err);
  });
  shell.on('end', code => {
    console.log("code", code);
  });
  return shell.invoke().then(output => {
    shell.dispose()
  });
}

// var shell = new Shell();


// module.exports = {
//   getInstance: function() {
//     if (!this.shell) {
//       this.shell = new Shell();
//       this.shell.on('output', data => {
//         console.log("data", data);
//       });
//       this.shell.on('err', err => {
//         console.log("err", err);
//       });
//       this.shell.on('end', code => {
//         console.log("code", code);
//       });
//     }
//     return this.shell;
//   },
//   speak: function(text) {
//     text = /[а-яА-ЯЁё]/.test(text) ? translit(text) : text;
//     // var shell = this.getInstance();
//     shell.addCommand('Add-Type -AssemblyName System.speech');
//     shell.addCommand('$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer');
//     shell.addCommand('$speak.Speak("' + text + '")');
//   }
// }

module.exports = sayWin;
