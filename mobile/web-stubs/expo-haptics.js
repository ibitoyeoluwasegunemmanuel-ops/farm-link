// Web stub — haptics not supported in browsers
const ImpactFeedbackStyle = { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' };
const NotificationFeedbackType = { Success: 'success', Warning: 'warning', Error: 'error' };
const SelectionFeedbackType = {};

const impactAsync = () => Promise.resolve();
const notificationAsync = () => Promise.resolve();
const selectionAsync = () => Promise.resolve();

module.exports = {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  SelectionFeedbackType,
  impactAsync,
  notificationAsync,
  selectionAsync,
};
