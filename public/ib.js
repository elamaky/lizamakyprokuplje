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
  ':poop:': '💩',
  ':fire:': '🔥',
  ':star:': '⭐',
  ':ok:': '👌',
  ':cool:': '😎',
  ':thumb:': '👍',
  ':pray:': '🙏',
  ':clap:': '👏',
  ':100:': '💯',
  ':heart:': '❤️'
};

function replaceTextEmoji(msg) {
  for (const key in textEmojiMap) {
    msg = msg.replaceAll(key, textEmojiMap[key]);
  }
  return msg;
}
