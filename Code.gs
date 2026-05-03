const APP_CONFIG = {
  spreadsheetName: 'Strategic Project Portfolio Data',
  properties: {
    spreadsheetId: 'SPM_SPREADSHEET_ID',
    spreadsheetUrl: 'SPM_SPREADSHEET_URL',
  },
  sheets: {
    metadata: 'Metadata',
    projects: 'Projects',
  },
};

function doGet() {
  initializeApp();
  return HtmlService.createHtmlOutputFromFile('project-portfolio-app')
    .setTitle('Strategic Project Portfolio')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function initializeApp() {
  const spreadsheet = createSpreadsheetIfNeeded_();
  ensureSchema_(spreadsheet);

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    data: loadPortfolio(),
  };
}

function loadPortfolio() {
  const spreadsheet = createSpreadsheetIfNeeded_();
  ensureSchema_(spreadsheet);

  const metadataSheet = spreadsheet.getSheetByName(APP_CONFIG.sheets.metadata);
  const projectsSheet = spreadsheet.getSheetByName(APP_CONFIG.sheets.projects);

  const metadataValues = metadataSheet.getDataRange().getValues();
  const metadata = metadataValues.slice(1).reduce((acc, row) => {
    if (row[0]) acc[row[0]] = row[1] || '';
    return acc;
  }, {});

  const projectValues = projectsSheet.getDataRange().getValues();
  const headers = projectValues[0] || [];
  const projects = projectValues.slice(1)
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] === '' ? '' : row[index];
      });
      return item;
    });

  return {
    vision: metadata.vision || '',
    mission: metadata.mission || '',
    projects: projects,
  };
}

function savePortfolio(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Missing payload');
  }

  const spreadsheet = createSpreadsheetIfNeeded_();
  ensureSchema_(spreadsheet);

  const metadataSheet = spreadsheet.getSheetByName(APP_CONFIG.sheets.metadata);
  const projectsSheet = spreadsheet.getSheetByName(APP_CONFIG.sheets.projects);
  const normalized = normalizePayload_(payload);

  metadataSheet.getRange(2, 1, 2, 2).setValues([
    ['vision', normalized.vision],
    ['mission', normalized.mission],
  ]);

  projectsSheet.clearContents();
  projectsSheet.getRange(1, 1, 1, PROJECT_HEADERS.length).setValues([PROJECT_HEADERS]);

  if (normalized.projects.length) {
    const rows = normalized.projects.map((project) => (
      PROJECT_HEADERS.map((header) => project[header] || '')
    ));
    projectsSheet.getRange(2, 1, rows.length, PROJECT_HEADERS.length).setValues(rows);
  }

  return {
    ok: true,
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    rowCount: normalized.projects.length,
    savedAt: new Date().toISOString(),
  };
}

const PROJECT_HEADERS = [
  'id',
  'name',
  'dept',
  'type',
  'duration',
  'objective',
  'strategy',
  'stakeholders',
  'kpi',
  'outcomes',
  'risks',
  'riskLevel',
  'riskMitigation',
  'itSystems',
  'itBudget',
  'itComplexity',
  'fte',
  'skills',
  'training',
  'budget',
  'roi',
  'payback',
  'nonFinancial',
  'status',
  'createdAt',
];

function createSpreadsheetIfNeeded_() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty(APP_CONFIG.properties.spreadsheetId);
  let spreadsheet;

  if (spreadsheetId) {
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      spreadsheet = null;
    }
  }

  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create(APP_CONFIG.spreadsheetName);
    properties.setProperty(APP_CONFIG.properties.spreadsheetId, spreadsheet.getId());
    properties.setProperty(APP_CONFIG.properties.spreadsheetUrl, spreadsheet.getUrl());
  }

  return spreadsheet;
}

function ensureSchema_(spreadsheet) {
  const metadataSheet = getOrCreateSheet_(spreadsheet, APP_CONFIG.sheets.metadata);
  if (metadataSheet.getLastRow() === 0) {
    metadataSheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    metadataSheet.getRange(2, 1, 2, 2).setValues([
      ['vision', ''],
      ['mission', ''],
    ]);
  }

  const projectsSheet = getOrCreateSheet_(spreadsheet, APP_CONFIG.sheets.projects);
  if (projectsSheet.getLastRow() === 0) {
    projectsSheet.getRange(1, 1, 1, PROJECT_HEADERS.length).setValues([PROJECT_HEADERS]);
  }

  if (spreadsheet.getSheets().length > 2) {
    const firstSheet = spreadsheet.getSheets()[0];
    if (
      firstSheet.getName() !== APP_CONFIG.sheets.metadata &&
      firstSheet.getName() !== APP_CONFIG.sheets.projects &&
      firstSheet.getLastRow() === 0 &&
      firstSheet.getLastColumn() === 0
    ) {
      spreadsheet.deleteSheet(firstSheet);
    }
  }
}

function getOrCreateSheet_(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function normalizePayload_(payload) {
  return {
    vision: String(payload.vision || ''),
    mission: String(payload.mission || ''),
    projects: Array.isArray(payload.projects) ? payload.projects.map(normalizeProject_) : [],
  };
}

function normalizeProject_(project) {
  const normalized = {};
  PROJECT_HEADERS.forEach((header) => {
    normalized[header] = project && project[header] != null ? String(project[header]) : '';
  });
  return normalized;
}
