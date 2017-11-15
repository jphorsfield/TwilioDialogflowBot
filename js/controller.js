chatApp.controller('chatController', function($scope, $http, $localStorage, $interval, $location, $anchorScroll, $window, $timeout,base64) {
	makeTheBody();
	$localStorage.message = [];	
	$scope.connectingAgent = false;
	$scope.$storage = $localStorage;
	var serviceBase  = $location.absUrl();
	serviceBase  = serviceBase.split('/?');
	serviceBase = serviceBase[0];
	$scope.sessionArray = [];
	//var encode = base64.encode('sovan');
	//console.log(base64.decode(encode));
	var parameters = getParameter();
	if(parameters['name']!=undefined){
		$http.get(serviceBase+'/login/'+parameters['phone']+'/'+parameters['name']).then(doLogin);
	} else if(parameters['session']!=undefined){
		
		//var data = base64.decode(parameters['session']+"=").split("-");
		var data = parameters['session'].split("-");
		var session = data[1];
		var id = data[0];
		console.log(parameters['session']);
		$http.get(serviceBase+'/login/'+id+'/'+session).then(doLogin);
	}
	function doLogin(result){
		$localStorage.userID = result.data.id;
		$scope.name = result.data.name;
		$localStorage.message = [];
		if(result.data.chat!=undefined){
			for(var i=0; i<result.data.chat.length; i++){
				$localStorage.message.push({"answer":result.data.chat[i]['a'],"answer-time":timeFormat(result.data.chat[i]['at']),"question":result.data.chat[i]['q'],"question-time":timeFormat(result.data.chat[i]['qt']),"callBack":result.data.chat[i]['cb'],"callBackAdded":timeFormat(result.data.chat[i]['cbt']),"session":result.data.chat[i]['s']});
			}
		}
		$localStorage.session = result.data.session;
		$scope.sessionArray.push($localStorage.session);
		console.log($localStorage.session)
	}
	
	function timeFormat(timeStrap){
		if(timeStrap==undefined || timeStrap==''){
			return undefined;
		}
		var time = new Date(timeStrap);
		var hours = time.getHours();
		var minute = (time.getMinutes()<10?'0':'')+time.getMinutes();
		var last = '';
		if (hours > 12) {
			hours -= 12;
			last = "PM";
		} else {
		   hours = 12;
		   last = "AM";
		}
		return hours+":"+minute+" "+last;
	}
	
	$scope.chats = $localStorage;
	$scope.askQuestion = function() { 
		if($scope.question!='' && $scope.question!=undefined){
			$http.post(serviceBase+'/normal-chat',{"question":$scope.question,"userID":$localStorage.userID,"session":$localStorage.session}).then(getAnswer);
			$localStorage.message.push({"question":$scope.question,"question-time":timeFormat(new Date()),"session":$localStorage.session});
			$scope.question = "";
			makeTheBody();
		}
	}
	function getAnswer(result){
		$localStorage.message.push({"answer":result.data.answer,"answer-time":timeFormat(new Date()),"session":$localStorage.session});
		if(result.data.action!=undefined && result.data.action=='CallBack'){
			$scope.phone = result.data.phone;
			$('#CallBack').modal('show');
		}
		makeTheBody();
	}
	
	$scope.callBack = function(result) { 
		
		if($scope.phone!='' && $scope.phone!=undefined){
			$http.post(serviceBase+'/call-back',{"phone":$scope.phone,"userID":$localStorage.userID,"session":$localStorage.session}).then(callBackSchedule);
			$localStorage.session = parseInt($localStorage.session)+1;
			$scope.sessionArray.push($localStorage.session);
			makeTheBody();
		}
	}
	
	
	
	function callBackSchedule(result){
		base64Session = $localStorage.userID+'-'+result.data.s;
		
		console.log(base64Session);
		
		$('#CallBack').modal('hide');
		$localStorage.message.push({"callBack":result.data.phone,"callBackAdded":timeFormat(new Date()),"session":result.data.s,"base64Session":base64Session});
		makeTheBody();
	}
	
	
	function makeTheBody(){
		$scope.height = $window.innerHeight-164;
		$scope.heightAdmin = $window.innerHeight-108;
		$timeout(function () {
			var scroller = document.getElementById("scrollDiv");
      		scroller.scrollTop = scroller.scrollHeight;
		}, 100);
	}
	
	
	angular.element($window).on('resize', function () {
		makeTheBody()
	});
	
	
	function getParameter(){
		var url = $location.absUrl();
		url = url.split('?');
		url = url[1];
		url = url.split('&');
		var returnData = {};
		for(i=0;i<url.length; i++){
			var parameter = url[i].split("=");
			returnData[parameter[0]] = parameter[1];
		}
		return returnData;
	}
	
});

