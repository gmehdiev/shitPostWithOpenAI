import { PrismaClient } from "@prisma/client";
import {config} from "dotenv";
import {Configuration, OpenAIApi} from "openai";
import { random } from "./random.js";
import { pushPosts } from "./pushPosts.js";
config()
const prisma = new PrismaClient()
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))



let title: string = '';
let descr: string = '';
let image: string = '';


export const createAIPosts = ()=>{
    console.log('start')
try {
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Придумай мне рандомный заголовок смешной новости короткое. В твоем ответе должно быть только название"}],
        temperature: random(),
        
    }).then(res =>{
        if (typeof res.data.choices[0].message == 'undefined') return
        title = res.data.choices[0].message.content
        console.log(title)
        openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: [{role: "user", content: `Придумай мне смешную новость с заголовком ${title}. В твоем ответе должна быть только новость`}]
          }).then(res =>{
            if (typeof res.data.choices[0].message == 'undefined') return
            descr = res.data.choices[0].message.content
            console.log(descr)
            openai.createImage({
                prompt: title,
                n: 1,
                size: "256x256",
              }).then(response =>{
                if (typeof response.data.data[0].url == 'undefined') return
                image = response.data.data[0].url;
                console.log(image)
                if (!title && descr && image) return
                pushPosts(title,descr,image)
              })
          })

    })
} catch (error) {
    console.log(error)
}
}
