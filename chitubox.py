import os
import json

fileList = os.listdir("./src/samples")
result = {}
for file in fileList:
    splits = file.split("_")
    brand = splits[1]
    model = splits[2]
    for i in range(3, len(splits) - 2):
        model = model + " " + splits[i]
    data = {}
    with open("./src/samples/" + file) as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith("@@"):
                continue
            line = line.strip()
            [key, value] = line.split(':')
            data[key] = value

    if brand not in result:
        result[brand] = {}

    result[brand][model] = data

with open("result.json", "w") as f:
    f.write(json.dumps(result))
