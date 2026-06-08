const fs = require('fs');

const data = {
  en: {
    navRecords: "Records",
    block: {
      "title": "Weight Tracking Log",
      "subtitle": "Track your personal records",
      "clearHistory": "Clear History",
      "clearHistoryConfirmTitle": "Confirm Clear",
      "clearHistoryConfirmDesc": "Are you sure you want to clear all weight history? This action cannot be undone.",
      "cancel": "Cancel",
      "confirmDelete": "Clear",
      "currentWeight": "Current Weight",
      "noData": "No data",
      "update": "Update",
      "weightHistory": "Weight History: {exercise}",
      "date": "Date",
      "weight": "Weight (kg)",
      "chartView": "Chart",
      "listView": "List",
      "emptyList": "You have no records for this exercise yet. Lift and update your weight!"
    }
  },
  fr: {
    navRecords: "Records",
    block: {
      "title": "Journal de suivi du poids",
      "subtitle": "Suivez vos records personnels",
      "clearHistory": "Effacer l'historique",
      "clearHistoryConfirmTitle": "Confirmer la suppression",
      "clearHistoryConfirmDesc": "Êtes-vous sûr de vouloir effacer tout l'historique de poids ? Cette action est irréversible.",
      "cancel": "Annuler",
      "confirmDelete": "Effacer",
      "currentWeight": "Poids actuel",
      "noData": "Aucune donnée",
      "update": "Mettre à jour",
      "weightHistory": "Historique de poids : {exercise}",
      "date": "Date",
      "weight": "Poids (kg)",
      "chartView": "Graphique",
      "listView": "Liste",
      "emptyList": "Vous n'avez pas encore de records pour cet exercice. Soulevez et mettez à jour votre poids !"
    }
  },
  ko: {
    navRecords: "기록",
    block: {
      "title": "체중 추적 로그",
      "subtitle": "개인 기록을 추적하세요",
      "clearHistory": "기록 지우기",
      "clearHistoryConfirmTitle": "삭제 확인",
      "clearHistoryConfirmDesc": "모든 체중 기록을 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      "cancel": "취소",
      "confirmDelete": "지우기",
      "currentWeight": "현재 체중",
      "noData": "데이터 없음",
      "update": "업데이트",
      "weightHistory": "체중 기록: {exercise}",
      "date": "날짜",
      "weight": "체중 (kg)",
      "chartView": "차트",
      "listView": "목록",
      "emptyList": "이 운동에 대한 기록이 아직 없습니다. 리프팅하고 체중을 업데이트하세요!"
    }
  },
  zh: {
    navRecords: "记录",
    block: {
      "title": "体重追踪日志",
      "subtitle": "追踪您的个人记录",
      "clearHistory": "清除历史记录",
      "clearHistoryConfirmTitle": "确认清除",
      "clearHistoryConfirmDesc": "您确定要清除所有体重历史记录吗？此操作无法撤销。",
      "cancel": "取消",
      "confirmDelete": "清除",
      "currentWeight": "当前体重",
      "noData": "暂无数据",
      "update": "更新",
      "weightHistory": "体重历史：{exercise}",
      "date": "日期",
      "weight": "体重 (kg)",
      "chartView": "图表",
      "listView": "列表",
      "emptyList": "您还没有此项运动的记录。开始举重并更新您的体重吧！"
    }
  },
  ja: {
    navRecords: "記録",
    block: {
      "title": "体重追跡ログ",
      "subtitle": "個人記録を追跡する",
      "clearHistory": "履歴を消去",
      "clearHistoryConfirmTitle": "消去の確認",
      "clearHistoryConfirmDesc": "すべての体重履歴を消去してもよろしいですか？この操作は元に戻せません。",
      "cancel": "キャンセル",
      "confirmDelete": "消去",
      "currentWeight": "現在の体重",
      "noData": "データなし",
      "update": "更新",
      "weightHistory": "体重履歴：{exercise}",
      "date": "日付",
      "weight": "体重 (kg)",
      "chartView": "チャート",
      "listView": "リスト",
      "emptyList": "この種目の記録はまだありません。リフティングして体重を更新しましょう！"
    }
  },
  pt: {
    navRecords: "Recordes",
    block: {
      "title": "Registro de Acompanhamento de Peso",
      "subtitle": "Acompanhe seus recordes pessoais",
      "clearHistory": "Limpar Histórico",
      "clearHistoryConfirmTitle": "Confirmar Limpeza",
      "clearHistoryConfirmDesc": "Tem certeza de que deseja limpar todo o histórico de peso? Esta ação não pode ser desfeita.",
      "cancel": "Cancelar",
      "confirmDelete": "Limpar",
      "currentWeight": "Peso Atual",
      "noData": "Sem dados",
      "update": "Atualizar",
      "weightHistory": "Histórico de Peso: {exercise}",
      "date": "Data",
      "weight": "Peso (kg)",
      "chartView": "Gráfico",
      "listView": "Lista",
      "emptyList": "Você ainda não tem recordes para este exercício. Levante peso e atualize seu peso!"
    }
  }
};

function insertAfterKey(obj, targetKey, insertKey, insertValue) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = value;
    if (key === targetKey) {
      newObj[insertKey] = insertValue;
    }
  }
  return newObj;
}

const dir = '/Users/minhducnguyen/gym-slave/messages';

Object.keys(data).forEach(lang => {
  const filePath = `${dir}/${lang}.json`;
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);
    
    // 1. nav -> insert 'records' after 'progress'
    if (json.nav && json.nav.progress) {
      json.nav = insertAfterKey(json.nav, 'progress', 'records', data[lang].navRecords);
    } else if (json.nav && !json.nav.progress) {
      json.nav.records = data[lang].navRecords;
    }

    // 2. header.pages -> insert 'records' after 'progress'
    if (json.header && json.header.pages && json.header.pages.progress) {
      json.header.pages = insertAfterKey(json.header.pages, 'progress', 'records', data[lang].navRecords);
    } else if (json.header && json.header.pages) {
      json.header.pages.records = data[lang].navRecords;
    }

    // 3. add 'records' at the END
    // To ensure it is at the very end, delete it if it exists (it shouldn't) and re-add
    delete json.records;
    json.records = data[lang].block;

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
    console.log(`Updated ${lang}.json`);
  } else {
    console.log(`${lang}.json not found!`);
  }
});
