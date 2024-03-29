import axios from "axios";

// const itab = axios.create({
//     timeout: 1000,
//     headers:{
//         'signaturekey': 'U2FsdGVkX1+Uk1qtXtnxOZ5SsRjMFSjd9Ab2WocjeVU=',
//         "version": "1.3.17",
//         "origin": "chrome-extension://inedkoakiaeepjoblbiiipedngonadhn"
//     }
// })

const getTodayEng = async ()=>{
    return axios.get(
        'https://random-words-api.vercel.app/word'
    )
}

const getCloudEng = async ()=>{
    return axios.get(
        'https://wykxldz.gitee.io/word-typing/collection.json'
    ).catch(err=>{
        return 'error'
    })
}

export {
    getTodayEng,
    getCloudEng
}