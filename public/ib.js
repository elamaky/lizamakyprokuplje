// textEmojiMap.js
const textEmojiMap = {
  ':)': '😊',
  ':(': '☹️',
  ':D': '😃',
  'xD': '😆',
  ':))': '😁',
  ':O': '😮',
  ';)': '😉',
  ':P': '😛',
  ':/': '😕',
  ':\'(': '😢',
  '>:(': '😠',
  ':|': '😐',
  ':-)': '🙂',
  ':-(': '🙁',
  ':-D': '😄',
  '<3': '❤️',
  '^^': '😄',
  ':*': '😘',
  'inx': '🎶🎶🎶🎶🎵🎶🎶🎵',
  ':fire:': '🔥',
  ':star:': '⭐',
  ':ok:': '👌',
  ':cool:': '😎',
  ':thumb:': '👍',
  ':pray:': '🙏',
  ':clap:': '👏',
   '#dg': '#n Dobro Dosli, Sa Vama Je Dj Dia ',
  'ziox': 'Za Inci Biserku Od *__X__*😎',
  ':heart:': '❤️'
};

function replaceTextEmoji(msg) {
  for (const key in textEmojiMap) {
    msg = msg.replaceAll(key, textEmojiMap[key]);
  }
  return msg;
}

