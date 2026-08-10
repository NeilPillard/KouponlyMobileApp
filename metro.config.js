const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);
const packageJson = require('./package.json');
const modulesRoot = fs.realpathSync(path.resolve(projectRoot, 'node_modules'));
config.watchFolders = [projectRoot, modulesRoot];

// Keep Metro anchored to the workspace's hoisted pnpm tree. This avoids
// Windows/OneDrive realpath resolution skipping packages that Node can resolve.
config.resolver.nodeModulesPaths = [modulesRoot];
config.resolver.disableHierarchicalLookup = false;
config.resolver.extraNodeModules = Object.fromEntries(
  Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies }).map((name) => [
    name,
    path.resolve(modulesRoot, name),
  ]),
);
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'whatwg-fetch') {
    return { type: 'sourceFile', filePath: path.resolve(modulesRoot, 'whatwg-fetch/dist/fetch.umd.js') };
  }
  if (moduleName === 'lucide-react-native') {
    return { type: 'sourceFile', filePath: path.resolve(modulesRoot, 'lucide-react-native/dist/cjs/lucide-react-native.js') };
  }
  try {
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    try {
      return { type: 'sourceFile', filePath: require.resolve(moduleName, { paths: [modulesRoot] }) };
    } catch {
      throw error;
    }
  }
};

module.exports = config;
