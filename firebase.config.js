// 🎯 強制模擬模式配置 - 專注於功能測試
console.log('🎯 初始化模擬模式（專注功能測試）...');

// 完全跳過Firebase初始化，直接使用模擬模式
const auth = null;
const db = null;
const app = null;

console.log('✅ 模擬模式初始化完成！');
console.log('📱 現在可以專注測試所有應用功能');

export { app, auth, db }; 