function getPhoneNumberFromChatId(chatID) {
    return chatID.replace('@c.us', '');
}

exports.getPhoneNumberFromChatId = getPhoneNumberFromChatId;