const { GoogleSpreadsheet } = require('google-spreadsheet');

const getSheetData = async function() {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  
  const sheet = doc.sheetsByTitle['emails'];
  const rows = await sheet.getRows()
  
  const data = rows.map(({email, chat_id}) => {
    return {
      email,
      chat_id
    }
  })

  return data;
}

const getUsersData = async function() {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['users'];
  const rows = await sheet.getRows();
  
  const data = rows.map(({chat_id, chat_type}) => {
    return {
      chatId: chat_id,
      chatType: chat_type
    }
  })
  
  return data;
}

const createUserRow = async function(chatId, chatType, created, username) {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['users'];

  await sheet.addRow({
    chat_id: chatId,
    chat_type: chatType,
    created,
    username
  });
}

module.exports = {
  getSheetData,
  getUsersData,
  createUserRow
}
