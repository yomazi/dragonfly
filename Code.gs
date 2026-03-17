const APP_URL = "https://raven.neuron9.io"; // your app's base URL

// Called when user opens the add-on homepage (no email selected)
function onHomepage(e) {
  return buildCard("Open Dragonfly", null);
}

// Called when user opens an email
function onGmailMessage(e) {
  const messageId = e.gmail.messageId;
  const threadId = e.gmail.threadId;
  return buildCard("Open in Dragonfly", { messageId, threadId });
}

function buildCard(buttonLabel, gmailContext) {
  // Build the URL — append context as query params if available
  let url = APP_URL + "/dragonfly";
  if (gmailContext) {
    url += "?messageId=" + gmailContext.messageId + "&threadId=" + gmailContext.threadId;
  }

  const openButton = CardService.newTextButton().setText(buttonLabel).setOpenLink(
    CardService.newOpenLink()
      .setUrl(url)
      .setOpenAs(CardService.OpenAs.FULL_SIZE) // opens in new tab
      .setOnClose(CardService.OnClose.NOTHING)
  );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("Dragonfly")
        .setBottomLabel("Click below to open your app")
    )
    .addWidget(CardService.newButtonSet().addButton(openButton));

  return CardService.newCardBuilder()
    .setName("dragonfly")
    .setHeader(CardService.newCardHeader().setTitle("Dragonfly").setSubtitle("Your app companion"))
    .addSection(section)
    .build();
}
