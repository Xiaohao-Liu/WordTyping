import json
import os
import time

data = {}
info = []
with open("collection.txt", "r", encoding="utf-8") as f:
    pre_data = []
    pre_idx = -1
    for idx, line in enumerate(f):
        if line[:2] == "-=":
            info.append({
                'id': idx, 
                'name': line[2:].strip()
            })
            if len(pre_data)>0:
                data[pre_idx] = pre_data
            pre_idx = idx
        if line.find(">")!=-1:
            t = line[line.find('.')+1:].split(">")
            pre_data.append({
                "id": idx,
                "english":t[0].strip(),
                "chinese":t[1].strip(),
            })
if len(pre_data)>0:
    data[pre_idx] = pre_data
    
all = {
    "info":info,
    "data":data
}
with open("./dist/collection.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(all))