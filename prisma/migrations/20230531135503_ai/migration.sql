-- CreateTable
CREATE TABLE "Post" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PostComments" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postUuid" TEXT NOT NULL,

    CONSTRAINT "PostComments_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_postUuid_fkey" FOREIGN KEY ("postUuid") REFERENCES "Post"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
