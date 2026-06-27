function isProfissional(papel) {
  return papel === "instrutor" || papel === "nutricionista";
}
function isAdmin(papel) {
  return papel === "admin";
}
export {
  isProfissional as a,
  isAdmin as i
};
