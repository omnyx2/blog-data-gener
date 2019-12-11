import { userPostGen } from './DataGen.mjs';
import fs from 'fs';


function getData(userNum,postNum){
	const jsonDataGen = userPostGen(userNum,postNum);
	const dataGen = JSON.parse(jsonDataGen);
	return dataGen;
}

var DATA_CENTER = {
	users:{
		"1":{
			"recent_post":{}	
		}	
	},
	books:[],
	serise:[],
	posts:[]
};

class dataController {
	constructor(userNum, postNum){
		this.data = getData(userNum, postNum);
		
	}		
	dataRebulider(){
		const rawDataArray = Array.from(this.data);
		
		rawDataArray.forEach((data, index, dataArray) => {
			console.log(index);
			this.dataInterpreter(data);
		});
	}	

	dataInterpreter = (data) => {
		//passed from Website
		const user = data.userId;
		const userNickName = data.headers.author;
		const tags = data.headers.tags; 
		const headers = data.headers;
		const postType = headers.type;
		const postContent = data.content;
		
		//search user data from Database
		const userdata = this.getUserData(user);
		const lastPostId = this.getLastIndexOfPosts();
		//put data to Database	
	        this.bulidUser(user);	
		const post = this.buildPost(user, headers,postContent,postType,lastPostId, data[postType], userNickName);
	}
	bulidUser(userId){
		if(DATA_CENTER.users[userId] === undefined){
			DATA_CENTER["users"]={
				[userId]:{
					"portfolio":{},
					"recent_post":{
						"headers":{},
						"content":{}
					},
					"postings":[],
					"all_tags":[],
					"serise":[],
					"books":[]
				}
			}
		} else {
		}
	}
	
	puttingPostInDb(post,id,userId){
		const tags = post[id].headers.tags;
		const postsTags = DATA_CENTER.users[userId].all_tags;
		DATA_CENTER.users[userId].recent_post.headers=post[id].headers;
		DATA_CENTER.users[userId].recent_post.content=post[id].content;
		console.log(postsTags);
		tags.forEach((element, index, array) => {
			if(!postsTags.includes(element)){
				DATA_CENTER.users[userId].all_tags.push(element);
			}
		});
		DATA_CENTER.users[userId].postings.push(id);
		DATA_CENTER.posts.push(post[id]);
	}
	puttingBookInDb(bookData, userId, bookId){
		DATA_CENTER.users[userId].books.push(bookData.post);
		DATA_CENTER.books.push(bookData);
	}
	puttingSeriseInDb(post,userId,seriseId,postId){
		
		DATA_CENTER.serise[seriseId].posts.push(postId);
		if(!DATA_CENTER.users[userId].serise.includes(seriseId)){
			DATA_CENTER.users[userId].serise.push(seriseId);
		}
	}

	puttingPostInSerise(userId,seriseId,postId){
		DATA_CENTER.serise[seriseId].posts.push[postId];
		DATA_CENTER.users[userId].serise.push(seriseId);
	}
	//create data for putting
	buildPost(userId, headers, content, postType, lastPostId, typeData, author){
		if( postType === "book"){		
			const lastBookId = this.getLastIndexOfBooks();
			const bookData = typeData;
			const bookAuthor = bookData.author;
			const bookPublished = bookData.published;
			const buildPost={
				[lastPostId]:{
					id: lastPostId,
					headers,
					content,
					[postType]:{
						id: (lastBookId),
						author: bookAuthor,
						published: bookPublished
					}	
				}
				
			}
			const buildBook={
				[lastBookId]:{
					id: lastBookId,
					title: bookData.title,
					author: bookAuthor,
					post: lastPostId,
					date: bookPublished
				}
			}
			this.puttingPostInDb(buildPost,lastPostId,userId);
			this.puttingBookInDb(buildBook[lastBookId], userId,lastBookId);
			return buildPost;
			 
		} else if (postType === "serise"){
			const theSerise = this.getSerise(typeData.id);
			if( theSerise === undefined ){
				const seriseId = this.getLastIndexOfSerise();
				const buildSerise = {
						id: seriseId,
						posts:[],
						title:typeData.title,
						author,
						published:typeData.published				
					}
				const buildPost={
					[lastPostId]:{
						id: lastPostId,
						headers,
						content,
						[postType]:{
							id: (seriseId),
							title: typeData.title,
						}	
					}
				}
				
				DATA_CENTER.serise.push(buildSerise);
				this.puttingPostInDb(buildPost,lastPostId,userId);
				this.puttingSeriseInDb(buildPost,userId,seriseId,lastPostId);
				
				return buildPost;
			} else {
				console.log(typeData);
				const seriseId = typeData.id;
				const buildPost={
					[lastPostId]:{
						id:lastPostId,
						headers,
						content,
						[postType]:{
							id: (seriseId),
							title: author,
						}	
					}
				};	
			console.log(buildPost);
			console.log(DATA_CENTER.serise);
			this.puttingPostInDb(buildPost,lastPostId,userId);
			this.puttingSeriseInDb(buildPost,userId,seriseId,lastPostId);
			return buildPost;
				console.log("end");
			}
		} else {
			const buildPost={
				[lastPostId]:{
					id: lastPostId,
					headers,
					content,
				}
			}
			this.puttingPostInDb(buildPost,lastPostId,userId);
			return buildPost;
		}
	}


	//Getting data sets
	getUserData = (userId) => {
		const isSignedUp = DATA_CENTER.users.hasOwnProperty(userId);
		if(isSignedUp === false){
			const defaultSignUp = {
				portfolio: {},
				recent_posts:{},
				all_tags:[],
				postings:[],
				serise:[],
				books:[]
			}
			return defaultSignUp;
		} else {
			return DATA_CENTER.users[userId]
		}	
	}
	getLastIndexOfBooks = () =>{
		const state = Object.keys(DATA_CENTER.books).length;
		return state;			
	}
	getLastIndexOfPosts(){
		return Object.keys(DATA_CENTER.posts).length;	
	}
	getLastIndexOfSerise(){
		return Object.keys(DATA_CENTER.serise).length;	
	}
	getSerise(seriseId){
		return DATA_CENTER.serise[seriseId];
	}
}

const test = new dataController(1,100);
test.dataRebulider();

const file = fs.createWriteStream('./data.json');
file.write(JSON.stringify(DATA_CENTER,null,2));
file.end();

