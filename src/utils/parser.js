module.exports = (techs) => {
  return String(techs).split(',').map(item => item.trim());
}