const path = require("path")

module.exports = {
  entry: "./src/javascript.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "",
    filename: "main.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader style-loader",
        },
      },
      {
        test: /\woff(2?)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "fonts",
          },
        },
      },
    ],
  },
}
