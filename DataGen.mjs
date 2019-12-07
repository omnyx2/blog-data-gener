import faker from 'faker';
class Data {
	constructor(){
		this.postId = 0;
		this.bookId = 0;
		this.seriseId = 0;
		this.languageTags = ["C","C++","python","Java","Kotlin","JavaScript","C#","CSS","HTML"];
		this.frameworkTags = ["Django","React","Redux","Arduino","Graph QL","node","express","docker"];
		this.allTags = this.languageTags.concat(this.frameworkTags);
	}

	randomIntGen(min,max){
		return Math.floor(Math.random()*(max-min)+min);
	}
	tagGen(){
		const tag = this.allTags[this.randomIntGen(0,this.allTags.length)];
		return tag;
	}
	tagsGen(){
		const tagsNum = this.randomIntGen(0, this.allTags.length);
		const tags = new Set();
		let i=0;
		for(i=0; i<tagsNum; i++){
			const tagIndex = this.randomIntGen(0,this.allTags.length);
			tags.add(this.allTags[tagIndex]);
		}
		return [...tags];
	}
	typeGen(){
		const types = ["serise", "book","normal"];
		const typeIndex = this.randomIntGen(0,3);
		return types[typeIndex];
	}
	userGen(){
		const userId = faker.finance.bitcoinAddress();
		const userAuthor = faker.internet.userName();
		const userImg = faker.image.avatar(); 
		return { 
			userId,
			userAuthor
		};		
	}
	rawPostGen(user){
		const type = this.typeGen();
		const tag = this.tagGen();
		const tags = this.tagsGen();
		const rawPost = function(){ 
			return {
				"userId": user.userId,
				"headers": {
					type,
					category: tag,
					image: faker.image.image(),
					tags: tags,//we need to fix this part 
					title: faker.lorem.words(),
					author: user.userAuthor,
					data:{
						created: faker.date.past(),
						fixed: faker.date.recent(),
					}
				},
				"content": faker.lorem.text()
			}
		};
		return rawPost();
	}
	postGen(user){
		const rawPost = this.rawPostGen(user);
		if(rawPost.headers.type === "book"){
			const bookData = {
				book: {
					title: faker.random.word(),
					author: faker.internet.userName(),
					published: faker.date.past()
				}
			}
			return { ...rawPost, ...bookData};
		} else if(rawPost.headers.type === "serise"){
			const seriseData = {
				serise:{
					id: this.randomIntGen(0,20),
					title: faker.database.column()
				}
			}
			return { ...rawPost, ...seriseData };
		} else if (rawPost.headers.type === "normal") {
			return rawPost;
		} else {
			return "error 1: Error! wrong post type!";
		}
	}

	dataGen(genOpt = { user }){
		const test = this.postGen(genOpt);
		return test;
	}
}



function userPostGen(userNum, eachPostNum){
	let j = 0;
	const dataArray = [];
	const datajson = new Data();
	while( j<userNum ){
		j++;
		const user = datajson.userGen();
		let i = 0;
		while(i<eachPostNum){
			i++;
			const temp = (datajson.dataGen(user));
			console.log(i);
			dataArray.push(temp);
		}
		
	}
	return (JSON.stringify(dataArray));
}


export { userPostGen };





