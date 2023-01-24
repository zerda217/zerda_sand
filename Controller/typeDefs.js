import { gql } from 'apollo-server-express';

/*
	사용자 레벨
		1 	- 기본 회원
		99	- 운영자
*/

const typeDefs = gql`
	scalar JSON

	type User {
		id 				: Int
		name 			: String!
		mail			: String
		password 	: String!
		level 		: Int
	}

	input UserInput {
		name 			: String!
		mail			: String
		password 	: String!
	}

	type Todo {
		id 							: Int
		title 					: String
		article 				: String
		register_user		: Int
		register_date 	: String
		update_date 		: String
		category 				: String
		complete				: Boolean
	}

	input TodoInput {
		title 				: String
		article 			: String
		register_user	: Int
		category 			: String
	}

	type Query {
		signIn(name:String!, password:String!) 			: JSON
		todoList(limit:Int = 10, fromId:Int, category:String) 		: JSON
		# todo(todoId:Int, userId:Int)	: JSON
		todo(todoId:Int, userId:Int, complete:Boolean)	: [Todo]

	}

	type Mutation {
		userUpdate(userInformation : UserInput, userId:Int) : JSON
		signUp(userInformation : UserInput) 	: JSON
		newPost(post : TodoInput)				: JSON
	}
`;

export default typeDefs