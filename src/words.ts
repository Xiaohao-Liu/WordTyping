import diji from './words/diji/all.json'
import dengding from './words/dengding/all.json'
import { getCloudEng } from './api'



const data = {
    'diji': {...diji},
    'dengding': {...dengding}
}

const cloud = await getCloudEng();
if(cloud != "error") data['cloud'] = {...cloud.data}
console.log(data)

const id2name = {
    'diji': "地基词",
    'dengding': '登顶词',
    'cloud': "Cloud"
}

export {
    data,
    id2name
}

