/*
 * seed is a float [0;1]
 */
var SimpleColorGenerator = function (opts) {
  var self = {}
  self.opts = opts ? opts : {};

  if (!('count' in self.opts)) self.opts.count = 10

  var hasSeed = ('seed' in self.opts)
  if (!hasSeed) self.opts.seed = Math.random()

  // if a seed is given, don't randomize the colors by default
  if (!('randomize' in self.opts)) self.opts.randomize = !hasSeed

  var delta = 1. / self.opts.count
  var hue01 = self.opts.seed * delta

  self.hues = []
  for (var i = 0; i < self.opts.count; i++) {
    self.hues.push(hue01 * 360)
    hue01 += delta
  }

  if (self.opts.randomize) shuffle(self.hues)

  self.getColors = function (opts) {
    if (!(opts)) opts = {}
    if (!('saturation' in opts)) opts.saturation = '50%'
    if (!('lightness' in opts)) opts.lightness = '50%'
    if (!('alpha' in opts)) opts.alpha = 1.

    var colors = []
    for (var i in self.hues) {
      colors.push(getColor(self.hues[i], opts.saturation, opts.lightness, opts.alpha));
    }
    return colors;
  }

  function getColor(h, s, l, a) {
    return "hsla(" + Math.floor(h) + "," + s + "," + l + "," + a + ")";
  }

  // Fisher-Yates
  function shuffle(array) {
    var i = 0,
      j = 0,
      temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

  return self;
};