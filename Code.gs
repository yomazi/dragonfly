/**
 * Homepage trigger — called by Apps Script when the add-on is opened
 * outside of any Gmail message context.
 *
 * @param {Object} e - The Apps Script add-on event object.
 * @returns {Card} A CardService Card built without message/thread context.
 */
function onHomepage(e) {
  const card = buildCard(null);

  return card;
}

/**
 * Gmail contextual trigger — called by Apps Script when the user opens a message.
 * The message and thread IDs are extracted from the event and passed to the
 * card builder as context.
 *
 * @param {Object} e - The Apps Script Gmail event object.
 * @param {string} e.gmail.messageId - The ID of the currently open message.
 * @param {string} e.gmail.threadId - The ID of the thread containing the message.
 * @returns {Card} A CardService Card built with message and thread context.
 */
function onGmailMessage(e) {
  const messageId = e.gmail.messageId;
  const threadId = e.gmail.threadId;

  const card = buildCard({ messageId, threadId });

  return card;
}

/**
 * Creates a CardService TextButton that opens the app in a new full-size tab.
 * If context is provided, the thread and message IDs are appended to the URL
 * as path segments so the app can load directly into the relevant thread.
 *
 * @param {Object|null} context - Gmail message context, or null on the homepage.
 * @param {string} context.threadId - The Gmail thread ID.
 * @param {string} context.messageId - The Gmail message ID.
 * @returns {TextButton} A CardService TextButton configured to launch the app.
 */
function createLaunchButton(context) {
  const url = context ? `${APP_URL}/${context.threadId}/${context.messageId}` : APP_URL;
  const button = CardService.newTextButton()
    .setText(BUTTON_LABEL)
    .setOpenLink(
      CardService.newOpenLink()
        .setUrl(url)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING)
    );

  return button;
}

/**
 * Builds a CardService CardSection containing descriptive text paragraphs
 * and a launch button. Paragraph content is sourced from either
 * PARAGRAPHS_MESSAGE_SELECTED or PARAGRAPHS_HOMEPAGE depending on whether
 * a message context is present.
 *
 * @param {Object|null} context - Gmail message context, or null on the homepage.
 * @param {string} context.threadId - The Gmail thread ID.
 * @param {string} context.messageId - The Gmail message ID.
 * @returns {CardSection} A CardService CardSection with text widgets and a launch button.
 */
function createSection(context) {
  const button = createLaunchButton(context);
  const section = CardService.newCardSection();
  const paragraphs = [...(context ? PARAGRAPHS_MESSAGE_SELECTED : PARAGRAPHS_HOMEPAGE)];

  paragraphs.forEach((p) => {
    section.addWidget(CardService.newTextParagraph().setText(p));
  });
  section.addWidget(CardService.newButtonSet().addButton(button));

  return section;
}

/**
 * Assembles and returns the main CardService Card for the Gmail add-on.
 * Composes a header (with image and topline subtitle) and a content section,
 * then builds and returns the final Card to be rendered by Apps Script.
 *
 * @param {Object|null} context - Gmail message context, or null on the homepage.
 * @param {string} context.threadId - The Gmail thread ID.
 * @param {string} context.messageId - The Gmail message ID.
 * @returns {Card} A fully constructed CardService Card.
 */
function buildCard(context) {
  const section = createSection(context);
  const topline = getTopline();
  const cardBuilder = CardService.newCardBuilder()
    .setName(APP_TITLE)
    .setHeader(CardService.newCardHeader().setImageUrl(IMAGE_URL).setSubtitle(topline))
    .addSection(section)
    .build();

  return cardBuilder;
}
