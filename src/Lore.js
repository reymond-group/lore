var Lore = { Version: '0.0.1' };

if(typeof define === 'function' && define.amd) {
  define('lore', Lore);
}
else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
  module.exports = Lore;
}

Lore.Mouse = {
  Left: 0,
  Middle: 1,
  Right: 2
}

Lore.Keyboard = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  Esc: 27
}

Lore.Shaders = { };
