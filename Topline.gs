/**
 * A pool of rotating subtitle strings displayed in the Card header.
 * One is selected at random each time the add-on loads.
 *
 * @type {string[]}
 */
const TOPLINES = [
  "A sanity-inducing tool for Gmail.",
  "A light in the dark fetid morass of Gmail.",
  "Your Gmail sanity kit.",
  "I'm dragonfly. You're welcome.",
  "... it's good for you!",
  "Gmail, but it's good.",
  "A Gmail pressure valve.",
  "Brain bleach for your inbox.",
  "A Gmail exorcist.",
  "Inbox therapy.",
  "Gmail without the suck.",
  "It's like Prozac for your inbox.",
  "Gmail, minus the spiraling insanity.",
  "Chaos tamer for Gmail.",
  "An inbox whisperer.",
  "Gmail detox kit.",
  "Inbox damage control.",
  "A Gmail intervention.",
  "The calm inside your inbox storm.",
  "Gmail, defanged.",
];

/**
 * Returns a randomly selected subtitle string from the TOPLINES pool.
 * Called each time a Card is built to give the header a bit of personality.
 *
 * @returns {string} A randomly chosen topline string.
 */
function getTopline() {
  const numToplines = TOPLINES.length;
  const index = Math.floor(Math.random() * numToplines);
  const result = TOPLINES[index];

  return result;
}
