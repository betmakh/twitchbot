var sayWin = (text) => {
  var Shell = require('node-powershell');
  var shell = new Shell({
    inputEncoding: 'binary'
  });
  shell.addCommand('Add-Type -AssemblyName System.speech');
  shell.addCommand('$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer');
  shell.addCommand('$speak.Speak("' + text + '")');
  shell.on('output', data => {
    console.log("data", data);
  });
  shell.on('err', err => {
      console.log("err", err);
  });
  shell.on('end', code => {
      console.log("code", code);
  });
  return shell.invoke();
}

module.exports = sayWin;