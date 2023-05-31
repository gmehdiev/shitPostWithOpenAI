import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export const pushPosts = async (title: string , descr: string , image: string) =>{
   
        try {
            const post = await prisma.post.create({
                data : {
                        title: title || "title" ,
                        description: descr || "descr" ,
                        image: image || "image" ,
                    }
                })
        } catch (error) {
            console.log(error)
        }
    
    
}