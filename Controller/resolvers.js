import pkg from '@prisma/client';
const { PrismaClient, Prisma } = pkg;
const prisma = new PrismaClient();
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken'
const secret = process.env.SECRET_KEY;
const jwtSecret = process.env.JWT_SECRET
import moment from 'moment';

const resolvers = {
    Query: {
        signIn : async (_, args, context) => {
            var message
            let token
            const signInUser = await prisma.user.findFirst({
                where : {
                    name : args.name,
                    password : crypto.createHmac('sha256', secret).update(args.password).digest('hex'),
                }})
            if (signInUser) {
                message = `로그인 성공`
                token = jsonwebtoken.sign({asdas:'asoida'}, jwtSecret, { expiresIn: '7d' })
            } else {
                message = `가입된 회원이 아닙니다`
            }
            console.log(signInUser)
            return {
                status  : 'ok',
                message : message,
                user    : {name: signInUser.name, id: signInUser.id},
                token   : token
            }
        },
        todoList : async (_, args, context)=>{

            const todoQuery = {
                orderBy : [{id : 'desc'}],
                select  : {
                    id              : true,
                    title           : true,
                    register_date   : true,
                    update_date     : true,
                    category        : true,
                    user            : true,
                    complete        : true,
                    },
                take    : args['limit'],
            }

            if (args.fromId) {
                todoQuery.cursor = {id : args.fromId}
            }
            if (args.category) {
                todoQuery.cursor = {category : args.category}
            }

            const todoList = await prisma.todo.findMany(todoQuery)

            return {
                status : 'ok',
                todoList : todoList
            }
        },
        todo : async(_, args, context)=>{
            var message
            
            if (args.userId) {
                var inquiryTodo = await prisma.todo.findMany({
                    where : {register_user : args.userId}
                })
            }
            if (args.complete) {
                var inquiryTodo = await prisma.todo.findMany({
                    where : {complete : args.complete}
                })
            }
            if (args.todoId) {
                var inquiryTodo = [await prisma.todo.findUnique({
                    where   : {id : args.todoId},
                })]
            }
            
            return inquiryTodo
        }
    },
    Mutation: {
        userUpdate : async (_, args, context) => {
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
        signUp : async (_, args, context) => {
            const user = await prisma
                .user
                .create({
                    data : {
                        name : args.userInformation.name,
                        mail : args.userInformation.mail,
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
        newPost : async (_, args, context) => {
            const inputPost = args.post
            console.log('post', inputPost)
            
            const post = await prisma.todo
                .create({
                    data : {
                        title : inputPost.title,
                        article : inputPost.article,
                        register_user : inputPost.register_user,
                        register_date : new Date().toISOString(),
                        category : inputPost.category
                    }
                })
            return {
                status : 'ok',
                post : post,
                register_date : new Date().toISOString(),
            }
        },
        updatePost : async (_, args, context) => {
            const updatePost = await prisma.todo.update({
                    where   : {
                        id : args['id']
                    },
                    data    : {
                        title       : args['title'],
                        complete    : args['complete'],
                        update_date : new Date()
                    }
                });
            console.log(updatePost)
            return updatePost
        }
    }
};

export default resolvers