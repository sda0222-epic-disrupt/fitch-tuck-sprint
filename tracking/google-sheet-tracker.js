/**
 * Leading Through the Fog Diagnostic: Google Sheet tracker
 *
 * Paste this whole file into Extensions > Apps Script in your Google Sheet,
 * then deploy it as a web app (Execute as: Me, Who has access: Anyone).
 *
 * Each run of the diagnostic gets one row, created when someone clicks
 * "Start the diagnostic" and updated after every answer. No names, emails
 * or IP addresses are recorded.
 */

const SHEET_NAME = 'Responses';
const HEADERS = ['Start time', 'Questions completed', 'Score (out of 40)', 'Result', 'Completed', 'Last update', 'Session ID'];
const RESULTS = ['', 'The fog thickens', 'The fog lessens', 'The fog clears'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const id = String(d.id || '');
    if (!/^[a-z0-9]{8,24}$/.test(id)) return reply('ignored');

    const answered = clampInt(d.answered, 0, 10);
    const score = clampInt(d.score, 0, 40);
    const result = RESULTS.indexOf(d.result) >= 0 ? d.result : '';
    const completed = d.completed === true && answered === 10 ? 'Yes' : 'No';

    const sheet = getSheet();
    const now = new Date();
    const row = findRow(sheet, id);

    if (!row) {
      sheet.appendRow([now, answered, score, result, completed, now, id]);
    } else {
      // Updates can arrive out of order; never let a row go backwards.
      const current = sheet.getRange(row, 2).getValue();
      if (answered >= Number(current || 0)) {
        sheet.getRange(row, 2, 1, 5).setValues([[answered, score, result, completed, now]]);
      }
    }
    return reply('ok');
  } catch (err) {
    return reply('error');
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return reply('The Leading Through the Fog tracker is running.');
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('A2:A').setNumberFormat('yyyy-mm-dd h:mm am/pm');
    sheet.getRange('F2:F').setNumberFormat('yyyy-mm-dd h:mm am/pm');
    sheet.setColumnWidths(1, HEADERS.length, 150);
  }
  return sheet;
}

function findRow(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, 7, last - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (ids[i][0] === id) return i + 2;
  }
  return 0;
}

function clampInt(v, min, max) {
  const n = Math.round(Number(v));
  return isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
