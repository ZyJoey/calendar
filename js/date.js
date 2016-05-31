var EventUtil={
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	getEvent:function(event){
		return event? 
			event:window.event;
	},
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBuddle=true;
		}
	},
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
};
/*格式化日期*/
Date.prototype.format=function(){
	var _year,_month,_date;
	_year=this.getFullYear();
	_month=this.getMonth()+1;
	_date=this.getDate();
	var str=_year+"-"+_month+"-"+_date;
	return str;
};
(function(){
	var body=document.body;
	/*日期输入框*/
	var date=document.getElementById("date");
	/*日期容器*/
	var container=document.getElementById("container");

	/*在输入框写入今天的日期*/
	function writeDate(){
		now=new Date().format();
		date.value=now;
	}
	/*弹出日历*/
	function createcalendar(event){
		EventUtil.removeHandler(date,"click",createcalendar);
		calendar=document.createElement("div");
		var event=EventUtil.getEvent(event);
		if(date.nextElementSibling!=calendar){
			calendar.id="calendar";
			calendar.className="calendar";
			container.appendChild(calendar);
			var str="<div class='triangle'></div><div class='item'><div class='left' id='left'></div><select id='allMonth' class='month'></select><select id='allYear' class='year'></select><div class='right' id='right'></div></div><dl class='week'><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl><dl id='listing' class='listing'></dl>";
			calendar.innerHTML=str;
			/*月份下拉框*/
			allMonth=document.getElementById("allMonth");
			/*年份下拉框*/
			allYear=document.getElementById("allYear");
			/*下拉框年份范围*/
			createOption(1960,2040);
			/*调用生日日历函数*/
			writecalendar();
			/*月份向前箭头*/
			var left=document.getElementById("left");
			/*月份向后箭头*/
			var right=document.getElementById("right");
			/*添加选择框更改监听事件*/
			EventUtil.addHandler(allMonth,"change",changeSelect); 
			EventUtil.addHandler(allYear,"change",changeSelect);
			/*添加左右箭头事件*/
			EventUtil.addHandler(left,"click",arrows);
			EventUtil.addHandler(right,"click",arrows);
			/*鼠标位于日历外时点击可移除日历*/
			EventUtil.addHandler(calendar,"mouseleave",function(event){
				EventUtil.addHandler(body,"click",removecalendar);
			});		
			/*鼠标位于日历内移除上述事件*/
			EventUtil.addHandler(calendar,"mouseover",function(event){
				EventUtil.removeHandler(body,"click",removecalendar);
			});
		}
	}
	/*生成日历中的下拉框*/
	function createOption(){
		if(arguments[0]<arguments[1]){
			var i,j;
			for(i=1;i<=12;i++){
				var option=document.createElement("option");
				var text=document.createTextNode(i+"月");
				var attr=document.createAttribute("value");
				attr.value=i;
				option.setAttributeNode(attr);
				option.appendChild(text);
				allMonth.appendChild(option);
			}
			for(k=arguments[0];k<=arguments[1];k++){
				var option=document.createElement("option");
				var text=document.createTextNode(k);
				var attr=document.createAttribute("value");
				attr.value=k;
				option.setAttributeNode(attr);
				option.appendChild(text);
				allYear.appendChild(option);
			}
		}else{
			alert("年份输入有误");
		}	
	}
	/*移除日历*/
	function removecalendar(event){
		var event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		/*下拉框可能会超出容器范围*/
		if(target!=allYear&&target!=allMonth&&target!=date){
			container.removeChild(calendar);
			EventUtil.addHandler(date,"click",createcalendar);
		}
	}
	/*填写日历*/
	function writecalendar(){
		var c,y,m,year;
		var listing=document.getElementById("listing");
		var test=date.value;
		var RegExpM=/-\d?\d/;
		var text=RegExpM.exec(test);
		allMonth.value=text[0].replace(/-/,"");
		allYear.value=test.substr(0,4);
		year=parseInt(allYear.value,10);
		c=parseInt(allYear.value.substr(0,2),10);
		y=parseInt(allYear.value.substr(2,2),10);
		m=parseInt(allMonth.value,10);
		fillcalendar(c,y,m,year);
		EventUtil.addHandler(listing,"click",selectDate);
	}
	function fillcalendar(c,y,m,year){
		/*根据年月计算每月一号星期几*/
		var listing=document.getElementById("listing");
		var mm=m;
		if(year%4==0&&year%100!=0||year%400==0){
			/*闰年*/
			var monthDay=[31,29,31,30,31,30,31,31,30,31,30,31];
		}else{
			/*平年*/
			var monthDay=[31,28,31,30,31,30,31,31,30,31,30,31];
		}
		if(m<3){
			y-=1;
			m+=12;
		}
		w=parseInt(c/4,10)-2*c+y+parseInt(y/4,10)+parseInt(26*(m+1)/10,10);
		w=(w%7+7)%7;
		var i,j=1,k=w;
		for(i=0;i<monthDay[mm-1]+w;i++){
			dd=document.createElement("dd");
			if(i==k){
				dd.appendChild(document.createTextNode(j));
				var attr=document.createAttribute("data-value");
				attr.value=year+"-"+mm+"-"+j;
				dd.setAttributeNode(attr);
				if(attr.value==now){
					dd.className="current";
				}else if(attr.value==date.value){
					dd.className="select";
				}
				j++;
				k++;
			}else{
				dd.className="blank";
			}
			listing.appendChild(dd);
		}
	}
	/*更改选择框事件*/
	function changeSelect(){
		var event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		var listing=document.getElementById("listing");
		calendar.removeChild(listing);
		listing=document.createElement("dl");
		listing.id="listing";
		listing.className="listing";
		calendar.appendChild(listing);
		var m,c,y,year;
		if(target==allMonth){
			m=parseInt(this.value,10);
			year=parseInt(allYear.value,10);
			c=parseInt(allYear.value.substr(0,2),10);
			y=parseInt(allYear.value.substr(2,2),10);
			date.value=date.value.replace(/-\d?\d-/,"-"+m+"-");
		}else if(target==allYear){
			year=parseInt(this.value,10);
			c=parseInt(this.value.substr(0,2),10);
			y=parseInt(this.value.substr(2,2),10);
			m=parseInt(allMonth.value,10);
			date.value=date.value.replace(/\d{4}/,year);
		};
		fillcalendar(c,y,m,year);
		EventUtil.addHandler(listing,"click",selectDate);
	}
	function selectDate(){
		var event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		for(var i=0;i<target.parentNode.children.length;i++){
			if(target.parentNode.children[i].className=="select"){
				target.parentNode.children[i].removeAttribute("class");
				break;
			}
		}
		target.className="select";
		date.value=target.getAttribute("data-value");
		removecalendar();
	}
	function arrows(){
		var event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		var m,c,y,year;
		var listing=document.getElementById("listing");
		calendar.removeChild(listing);
		listing=document.createElement("dl");
		listing.id="listing";
		listing.className="listing";
		calendar.appendChild(listing);
		m=parseInt(allMonth.value);
		year=parseInt(allYear.value,10);
		if(target.id=="left"){
			if(m==1){
				year-=1;
				m=12;
			}else{
				m-=1;
			}
			
		}else if(target.id=="right"){
			if(m==12){
				year+=1;
				m=1;
			}else{
				m+=1;
			}
		}
		date.value=date.value.replace(/\d{4}-\d?\d/,year+"-"+m);
		allMonth.value=m;
		allYear.value=year;
		c=parseInt(year.toString().substr(0,2),10);
		y=parseInt(year.toString().substr(2,2),10);
		fillcalendar(c,y,m,year);
		EventUtil.addHandler(listing,"click",selectDate);
	}
	EventUtil.addHandler(window,"load",writeDate);
	EventUtil.addHandler(date,"click",createcalendar);
	EventUtil.addHandler(date,"change",writecalendar);

})();