const path = require("path");
const pak = require("../package.json");

module.exports = {
    dependencies: {
        [pak.name]: {
            root: path.join(__dirname, ".."),
        },
        "react-native": {
            root: path.join(__dirname, "..", "node_modules", "react-native"),
        },
        "react-native-windows": {
            root: path.join(__dirname, "..", "node_modules", "react-native-windows"),
        },
    },
};