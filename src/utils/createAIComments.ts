import { PrismaClient } from "@prisma/client";
import {config} from "dotenv";
import {Configuration, OpenAIApi} from "openai";
import { random } from "./random.js";
import { pushComments } from "./pushComments.js";
config()
const prisma = new PrismaClient()
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

let commentName : string = ''
let commentDescr : string = ''
let commentImage : string = ''

export const createAIComments = ()=>{
    console.log('start')
try {
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Придумай мне рандомный ник. В твоем ответе должен быть только ник"}],
        temperature: random(),
        
    }).then(res =>{
        if (typeof res.data.choices[0].message == 'undefined') return
        commentName = res.data.choices[0].message.content
        console.log(commentName)
        openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: [{role: "user", content: `Придумай мне короткий комментарий на любую тему. В твоем ответе должен быть только комментарий`}]
          }).then(res =>{
            if (typeof res.data.choices[0].message == 'undefined') return
            commentDescr = res.data.choices[0].message.content
            console.log(commentDescr)
            openai.createImage({
                prompt: commentName,
                n: 1,
                size: "256x256",
              }).then(response =>{
                if (typeof response.data.data[0].url == 'undefined') return
                commentImage = response.data.data[0].url;
                console.log(commentImage)
                if (!commentName && commentDescr && commentImage) return
                pushComments(commentName,commentDescr,commentImage)
              })
          })

    })
} catch (error) {
    console.log(error)
}
}