const fs = require("fs");

const SaveData = (servers) => {
    fs.writeFileSync("./data.json", JSON.stringify(servers, null, 2));
}

const ReadData = () => {
    const data = fs.readFileSync("./data.json");
    return JSON.parse(data);
}

module.exports = {
    SaveData,
    ReadData
}