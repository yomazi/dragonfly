/** @type {string} The display name of the add-on, used as the Card title. */
const APP_TITLE = "dragonfly";

/** @type {string} The base URL of the app. Thread and message IDs are appended as path segments when launching from a message context. */
const APP_URL = "https://raven.neuron9.io/shows/default/dragonfly"; // your app's base URL

/** @type {string} URL of the header image displayed in the Card header. */
const IMAGE_URL = "https://raw.githubusercontent.com/yomazi/dragonfly/main/assets/dragonfly.png";

/** @type {string} Label for the launch button rendered in each Card. */
const BUTTON_LABEL = "Launch Raven";

/**
 * Paragraphs displayed in the Card section when no email is selected (homepage context).
 * Supports inline HTML for bold/italic text, as rendered by CardService TextParagraph widgets.
 *
 * @type {string[]}
 */
const PARAGRAPHS_HOMEPAGE = [
  "Use <b>raven</b> to automatically format and label any email you send.",
  "",
  "Click the button below to get started.",
  "",
];

/**
 * Paragraphs displayed in the Card section when a Gmail message is open.
 * Supports inline HTML for bold/italic text, as rendered by CardService TextParagraph widgets.
 *
 * @type {string[]}
 */
const PARAGRAPHS_MESSAGE_SELECTED = [
  "Use <b>raven</b> to apply this email's contents to new work tasks: automatically format and label any replay, forward, or new message you send, as well as categorize, rename and upload file attachments.",
  "",
  "Click the button below to get started.",
  "",
];
