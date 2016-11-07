export const paths = (() => {
  const srcDir = 'src';
  const distDir = 'dist';
  const testDir = 'test';
  const tmpDir = 'tmp';
  const libDir = 'lib';

  return {
    srcDir,
    distDir,
    testDir,
    tmpDir,
    libDir,
    bundleName: 'analytics.js'
  };
})();

export const ports = {
  devServer: 3000,
  testServer: 3001
};

export const tracker = {
  trackerName: 'tracker',
  trackerNamespace: 'analytics',
  appId: 'example',
  cookieDomain: 'example.com'
};
