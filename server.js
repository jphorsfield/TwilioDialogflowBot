const API_AI_TOKEN = '############'; //all hand demo


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const apiAiClient = require('apiai')(API_AI_TOKEN);
const Twilio = require('twilio');
const router = require('./src/router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors());
var date = require('date-and-time');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/bot';

var url = '###########';

var http = require("http");
var dir =  process.cwd();
app.use(express.static(dir)); //current working directory
app.use(express.static(__dirname)); //module directory

app.use(router);

var server = http.createServer(app);

app.listen(5001, console.log('BOT server listing on 5001'));

app.get('/finesse', function(req, res){
	res.sendFile(__dirname + '/finesse.html');	 
});

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get("/chat/login/:phone/:name", function(req, res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var collection = 'user';
		collection = db.collection(collection);
		//var records = collection.findOne({"phone":req.params.phone}, function(err, result) {
		var records = collection.findOne({"phone":req.params.phone}, function(err, result) {
			if (err) throw err;
			if(result==null){
				var iniated = new Date().getTime();
				collection.insertOne({"phone":req.params.phone,"name":req.params.name,"session":1,"chat":[]}, function(err, res2) {
					if (err) throw err;
					db.close();
					res.status(200).end(JSON.stringify({"login":"yes","id":res2['ops'][0]['_id'],chat:[],"session":1}));
				});
			} else {
				if(result['chat'].length){
					result['session'] = result['chat'][(result['chat'].length-1)]['s']+1;
				} else {
					result['session']=1;
				}
				collection.updateOne({ _id: ObjectId(result['_id']) },{$set:{"name":req.params.name,"session":result['session']}}, function(err, res2) {
					if (err) throw err;
					res.status(200).end(JSON.stringify({"login":"yes","id":result['_id'],chat:result['chat'],"session":result['session']}));
					db.close();
				});
			}
		});
	});
});

//db.user.aggregate([{ "$match": { "name": "Sovan Dey" } }, { "$project": { "chat": { "$slice": [ "$chat", -1 ] } } }]).pretty()



app.get("/finesse/login/:id/:session", function(req, res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var collection = 'user';
		collection = db.collection(collection);
		var records = collection.findOne({"_id":ObjectId(req.params.id)}, function(err, result) {
			if (err) throw err;
			if(result!=null){
				db.close();
				res.status(200).end(JSON.stringify({"login":"yes","id":result['_id'],"name":result['name'],chat:result['chat'],session:req.params.session}));
			}
		});
	});
});


app.post('/chat/normal-chat', function(req, res){
	var question = req.body.question;
	var userID = req.body.userID;
	var session = req.body.session;
	var returnData = {};
	const apiaiSession = apiAiClient.textRequest(question, {sessionId: 'botcube_co'});
	
	
	var collection = 'user';
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		collection = db.collection(collection);
			var newValues = {$push:{"chat":{"q":question,"s":session,"qt":new Date().getTime()}}}
		collection.updateOne({ _id: ObjectId(userID) }, newValues, function(err, res) {
			if (err) throw err;
			db.close();
		});
	});
	
	
	apiaiSession.on('response', (response) => {
		const result = response.result.fulfillment.speech;
		var collection = 'user';
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			collection = db.collection(collection);
			var answerWrite = result.split('<<CallBack>>').join('');
			if(result.split('<<CallBack>>').length>1){
				var records = collection.findOne({ _id: ObjectId(userID) }, function(err, result) {
					returnData = {"answer":answerWrite,"action":"CallBack","phone":result.phone,"s":session};
					var newValues = {$push:{"chat":{"a":answerWrite,"s":session,"at":new Date().getTime()}}}
					collection.updateOne({ _id: ObjectId(userID) }, newValues, function(err, res) {
						if (err) throw err;
						db.close();
					});
					res.status(200).end(JSON.stringify(returnData));
				});
			} else {
				returnData = {"answer":answerWrite,"s":session};
				var newValues = {$push:{"chat":{"a":answerWrite,"s":session,"at":new Date().getTime()}}}
				collection.updateOne({ _id: ObjectId(userID) }, newValues, function(err, res) {
					if (err) throw err;
					db.close();
				});
				res.status(200).end(JSON.stringify(returnData));
			}
		});
		
	});
	apiaiSession.on('error', error => console.log(error));
	apiaiSession.end();
});



app.post('/chat/call-back', function(req, res){
	var phone = req.body.phone;
	var userID = req.body.userID;
	var session = req.body.session;
	var returnData = {};
	var collection = 'user';
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		collection = db.collection(collection);
		var newValues = {$push:{"chat":{"cb":req.body.phone,"cbt":new Date().getTime(),"s":session}}}
		collection.updateOne({ _id: ObjectId(userID) }, newValues, function(err, res) {
			if (err) throw err;
			db.close();
		});
	});
	res.status(200).end(JSON.stringify({"callback":"yes","phone":req.body.phone,"s":session}));
});




app.get('/:anything/js/:data', function(req, res){
	res.sendFile(__dirname + '/js/'+req.params.data);
});

app.get('/:anything/css/:data', function(req, res){
	res.sendFile(__dirname + '/css/'+req.params.data);
});

app.get('/:anything/images/:data', function(req, res){
	res.sendFile(__dirname + '/images/'+req.params.data);
});








