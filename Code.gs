function getFileAttachmentDescriptor(messageId) {
  const message = GmailApp.getMessageById(messageId);
  const attachments = message.getAttachments();
  const attachmentDescriptor = attachments.length ? attachments.length : "none";
  const result = `${PARAGRAPH_FILE_ATTACHMENTS} <b>${attachmentDescriptor}</b>`;

  return result;
}

// Called when user opens the add-on homepage (no email selected)
function onHomepage(e) {
  const card = buildCard(null);

  return card;
}

// Called when user opens an email
function onGmailMessage(e) {
  const messageId = e.gmail.messageId;
  const threadId = e.gmail.threadId;
  const accessToken = e.gmail.accessToken;

  GmailApp.setCurrentMessageAccessToken(accessToken);

  const card = buildCard({ messageId, threadId });

  return card;
}

function createLaunchButton(context) {
  // Build the URL — append context as query params if available
  const url = context ? `${APP_URL}/${context.threadId}/${context.messageId}` : APP_URL;
  const button = CardService.newTextButton().setText(BUTTON_LABEL).setOpenLink(
    CardService.newOpenLink()
      .setUrl(url)
      .setOpenAs(CardService.OpenAs.FULL_SIZE) // opens in new tab
      .setOnClose(CardService.OnClose.NOTHING)
  );

  return button;
}

function createSection(context) {
  const button = createLaunchButton(context);
  const section = CardService.newCardSection();
  const paragraphs = [...(context ? PARAGRAPHS_MESSAGE_SELECTED : PARAGRAPHS_HOMEPAGE)];
  const attachmentDescriptor = context ? getFileAttachmentDescriptor(context.messageId) : "";

  if (context) paragraphs.unshift(attachmentDescriptor);
  paragraphs.forEach((p) => {
    section.addWidget(CardService.newTextParagraph().setText(p));
  });
  section.addWidget(CardService.newButtonSet().addButton(button));

  return section;
}

function getTopline() {
  const numToplines = TOPLINES.length;
  const index = Math.floor(Math.random() * numToplines);
  const result = TOPLINES[index];

  return result;
}

function buildCard(context) {
  const section = createSection(context);
  const topline = getTopline();
  const cardBuilder = CardService.newCardBuilder()
    .setName("dragonfly")
    .setHeader(CardService.newCardHeader().setImageUrl(IMAGE_URL).setSubtitle(topline))
    .addSection(section)
    .build();

  return cardBuilder;
}
