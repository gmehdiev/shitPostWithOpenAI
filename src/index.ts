import { PrismaClient } from "@prisma/client";
import {config} from "dotenv";
import {Configuration, OpenAIApi} from "openai";
import * as cron from 'node-cron';
import { Console } from "console";

config()
const prisma = new PrismaClient()
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

const random = () =>{
    return Math.random() * 2;
}

let currentUUID: string 
let lastPost = await prisma.post.findFirst({
    orderBy: {
        createdAt: 'desc'
      }
}).then(res =>{
    if (typeof res?.uuid === "undefined") return
    currentUUID = res?.uuid
    console.log(`хуй ${currentUUID}`)
})

console.log(lastPost)


let title: string = '';
let descr: string = '';
let image: string = '';

let commentName : string = ''
let commentDescr : string = ''
let commentImage : string = ''


const GetShit = ()=>{
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
                main(title,descr,image)
              })
          })

    })
} catch (error) {
    console.log(error)
}
}



const GetShitComment = ()=>{
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
                mainComment(commentName,commentDescr,commentImage)
              })
          })

    })
} catch (error) {
    console.log(error)
}
}


async function main(title: string , descr: string , image: string ) {
    try {
        const post = await prisma.post.create({
            data : {
                    title: title || "title" ,
                    description: descr || "descr" ,
                    image: image || "image" ,
                }
            })
            currentUUID = post.uuid
    } catch (error) {
        console.log(error)
    }

}

async function mainComment(name: string , descr: string , image: string ) {
    try {
        const post = await prisma.postComent.create({
            data : {
                    name: name || "title" ,
                    comment: descr || "descr" ,
                    image: image || "image" ,
                    postUuid:currentUUID
                }
            })
            // currentUUID = post.uuid
    } catch (error) {
        console.log(error)
    }

}

const array = await prisma.postComent.findMany({
    where: {
        postUuid : 'e24f8468-7e8c-443d-9a85-5cb607b4aaa6'
    }
})
console.log(array)

const task = cron.schedule('*/5 * * * *', GetShit);
const comment = cron.schedule('*/30 * * * * *', GetShitComment);
task.start()
comment.start()
