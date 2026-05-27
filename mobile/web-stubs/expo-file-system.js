// Web stub — expo-file-system is native only
const documentDirectory = null;
const cacheDirectory = null;
const bundleDirectory = null;

const getInfoAsync = () => Promise.resolve({ exists: false, isDirectory: false, size: 0 });
const readAsStringAsync = () => Promise.resolve('');
const writeAsStringAsync = () => Promise.resolve();
const deleteAsync = () => Promise.resolve();
const moveAsync = () => Promise.resolve();
const copyAsync = () => Promise.resolve();
const makeDirectoryAsync = () => Promise.resolve();
const readDirectoryAsync = () => Promise.resolve([]);
const downloadAsync = () => Promise.resolve({ uri: '', status: 200, headers: {}, md5: '' });
const uploadAsync = () => Promise.resolve({ status: 200, headers: {}, body: '' });
const createDownloadResumable = () => ({
  downloadAsync: () => Promise.resolve(),
  pauseAsync: () => Promise.resolve(),
  resumeAsync: () => Promise.resolve(),
  savable: () => ({}),
});

module.exports = {
  documentDirectory,
  cacheDirectory,
  bundleDirectory,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  moveAsync,
  copyAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
  downloadAsync,
  uploadAsync,
  createDownloadResumable,
};
