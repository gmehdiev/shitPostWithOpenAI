import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
let currentUUID: string;
let lastPost = await prisma.post.findFirst({
    orderBy: {
        createdAt: 'desc'
      }
}).then(res =>{
    if (typeof res?.uuid === "undefined") return
    currentUUID = res?.uuid
})
export const pushComments = async (name: string , descr: string , image: string) =>{

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