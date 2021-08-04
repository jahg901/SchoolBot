const fs = require("fs");

const SaveData = (servers) => {
    fs.writeFileSync("./data.json", JSON.stringify(servers, (key, value) => {
        if (key === "notify") {
            return null;
        }
        return value;
    }, 2));
}

const ReadData = () => {
    const data = fs.readFileSync("./data.json");
    return JSON.parse(data);
}

module.exports = {
    SaveData,
    ReadData
}