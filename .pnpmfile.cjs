// Allow build scripts for bundling tools
function readPackage(pkg) {
  return pkg;
}

module.exports = { hooks: { readPackage } };
