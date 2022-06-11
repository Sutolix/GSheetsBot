const { GoogleSpreadsheet } = require('google-spreadsheet');

const getSheetData = async function() {
  const doc = new GoogleSpreadsheet('1gTutBxoMZs5mb8CR_MszFyRjw9rTtkRrpt39HtUJkng');
  
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()
  
  const data = rows.map(({email, chat_id}) => {
    return {
      email,
      chat_id
    }
  })
  
  return data;
}

module.exports = {
  getSheetData
}
