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
		password 	: String!
		level 		: Int
	}

	input UserInput {
		name 			: String!
		password 	: String!
	}

	type Query {
		signIn(name:String!, password:String!) 			: JSON
	}

	type Mutation {
		userUpdate(userInformation : UserInput, userId:Int) : JSON
		signUp(userInformation : UserInput) 	: JSON
	}
`;

export default typeDefs