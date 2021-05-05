const DIST_DIR = __dirname + "/client/dist";
const SRC_DIR = __dirname + "/client/src";

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: SRC_DIR,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      }
    ]
  },
	resolve: {
    extensions: [".js", ".jsx"]
  }
};
