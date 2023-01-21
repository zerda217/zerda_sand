import pkg from '@prisma/client';
const { PrismaClient, Prisma } = pkg;
const prisma = new PrismaClient();
import crypto from 'crypto';
const secret = process.env.SECRET_KEY;
import moment from 'moment';

const resolvers = {
    Query: {
        signIn : async (_, args, context) => {
            var message
            const signInUser = await prisma.user.findFirst({
                where : {
                    name : args.name,
                    password : crypto.createHmac('sha256', secret).update(args.password).digest('hex'),

                }})
            if (signInUser) {
                message = `로그인 성공`
            } else {
                message = `가입된 회원이 아닙니다`
            }
            console.log(signInUser)
            return {
                status  : 'ok',
                message : message,
                args    : args,
                user    : signInUser
            }
        },
    },
    Mutation: {
        userUpdate : async (_, args, context)=>{
            const user = await prisma.user.findUnique({
                where : { id : args.userId}
            })

            const userUpdate = await prisma.user.update({
                where : {id : args.userId},
                data : { 
                    name : args.userInformation.name,
                    update_date : new Date().toISOString()
                }
            })

            return userUpdate
        },
        signUp : async (_, args, context) =>{
            const user = await prisma
                .user
                .create({
                    data : {
                        name : args.userInformation.name,
                        password : crypto.createHmac('sha256', secret).update(args.userInformation.password).digest('hex'),
                        level : 1
                    }
                });

            return {
                status : 'ok',
                args : args,
                user : user
            }
        },
    }
};

export default resolvers