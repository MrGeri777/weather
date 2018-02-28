var parsed_dates;
var days = document.getElementsByClassName('day');
var sells = document.getElementsByClassName('sell');
window.onload=function(){
	start();
	changed_foc(localStorage.dayfoc);
}
function start(){
	if(!$_GET("city")||!$_GET("region")){
		if(!localStorage.city||!localStorage.region){localStorage.city="San_Francisco"; localStorage.region="CA";}
		location.href = 'index.html?city='+localStorage.city+'&region='+localStorage.region;
	}
	document.getElementById("city").innerHTML = $_GET("city");
	var now = new Date();
	now.setDate(now.getDate() + 2); 
	var today = dateFormat(now, 'Y-m-d');
	now.setDate(now.getDate() + 6);
	var tommorow = dateFormat(now, 'Y-m-d');
	var datepic = document.getElementById("picolo"); 
	var now = new Date();
	now.setDate(now.getDate() + 1); 
	var sey = dateFormat(now, 'Y-m-d');
	datepic.value = sey;
	datepic.setAttribute("min", today); datepic.setAttribute("max", tommorow);
	var return_10Day = get_api("http://api.wunderground.com/api/c7f652914607e41c/forecast10day/q/"+$_GET("region")+"/"+$_GET("city")+".json");
	parsed_dates = JSON.parse(return_10Day);
	create_date(0, 0); create_date(1, 1);create_date(2, 7);
}
function changed_foc(day){
	for (var i = 0; i < days.length; i++) {
		days[i].className = 'day';
	}
	days[day].className = 'day active';
	for (var i = 0; i < days.length; i++) {
		sells[i].className = 'sell';
	}
	sells[day].className = 'sell add';
	localStorage.dayfoc = day;;
}
function change_date(val){
	var date2 = new Date(val);
	var now = new Date();
	var timeDiff = Math.abs(date2.getTime() - now.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	create_date("2", diffDays)
}
function change_city(val) {
	arr = val.split(':');
	localStorage.city=arr[0]; localStorage.region=arr[1];
	location.href = 'index.html?city='+localStorage.city+'&region='+localStorage.region;
}
function create_date(cast,day) {
	var where = null;
	var date = parsed_dates.forecast.simpleforecast.forecastday[day];
	if(cast==0){
		where = "day1";
	}
	else if(cast==1){
		where = "day2";
	}
	else{
		where = "changed";
	}
		var dd = date.date.day;
		var mm = date.date.month;
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	document.getElementById(where).getElementsByClassName("img")[0].setAttribute("src", date.icon_url);
	document.getElementById(where).getElementsByClassName("date")[0].innerHTML = dd+"-"+mm+"-"+date.date.year;
	document.getElementById(where).getElementsByClassName("temp")[0].innerHTML = date.high.celsius+"C";
	document.getElementById(where).getElementsByClassName("wind")[0].innerHTML = date.maxwind.mph+"mph";
	document.getElementById(where).getElementsByClassName("humd")[0].innerHTML = date.avehumidity+"mm";

}
function get_date(date){
	var today = new Date(date);
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var today = dd+mm;
	return today;
}
function get_api(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.send();
	if (xhr.status != 200) {
		return xhr.status;
	} else {
		return xhr.responseText;
	}
}
function $_GET(key) {
	var s = window.location.search;
	s = s.match(new RegExp(key + '=([^&=]+)'));
	return s ? s[1] : false;
}