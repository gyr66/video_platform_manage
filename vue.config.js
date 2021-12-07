let JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  filenameHashing: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.ico$/,
          loader: "url-loader",
          exclude: /node_modules/,
        }
      ]
    },
    output: {
      filename: `js/[name].js`,
      chunkFilename: `js/[name].js`
    },
    plugins: [
      // new JavaScriptObfuscator({
      //   compact: false,
      //   controlFlowFlattening: false,
      //   deadCodeInjection: false,
      //   debugProtection: false,
      //   debugProtectionInterval: false,
      //   identifierNamesGenerator: 'mangled',
      //   disableConsoleOutput: false,
      //   log: false,
      //   numbersToExpressions: false,
      //   renameGlobals: false,
      //   selfDefending: false,
      //   simplify: false,
      //   splitStrings: false,
      //   stringArray: false,
      //   stringArrayEncoding: [],
      //   stringArrayIndexShift: false,
      //   stringArrayRotate: false,
      //   stringArrayShuffle: false,
      //   stringArrayWrappersChainedCalls: false,
      //   unicodeEscapeSequence: false
      // }, )
    ]
  },
  publicPath: './'
}

