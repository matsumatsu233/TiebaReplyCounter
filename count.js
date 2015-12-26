var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.3.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//get url
var url = location.href;
if(url.indexOf("kz")>0){
	//tieba.baidu.com/f?kz=***
	url = "http://tieba.baidu.com/p/"+url.substring(url.indexOf("kz")+3);
	url = url.split("?")[0];
} else {
	//tieba.baidu.com/p/***
	url = url.split("?")[0];
}

//get page count
var page_count = $("#thread_theme_5>div>ul>li:eq(1)>span:eq(1)").html();

//result set
var count_result = {};
var count_ajax=0;

//send request to each page
for(var i=0;i<page_count;i++){
	req_url = url+"?pn="+(i+1);
	$.ajax(req_url).done(function(content){
		var doc = document.implementation.createHTMLDocument("html");
		doc.documentElement.innerHTML = content;

		//start count
		var re = 0;
		//get user name by class "d_name"
		while($(doc).find(".d_name")[re]){
			if(count_result[$(doc).find(".d_name").eq(re).text().trim()]){
				count_result[$(doc).find(".d_name").eq(re).text().trim()]++;
			} else{
				count_result[$(doc).find(".d_name").eq(re).text().trim()] = 1;
			}
			re++;
		}
		count_ajax++;
	});
}

//show status
var result_table = $("<table>");
result_table.html("<tr><td>统计中.</td></tr>");
result_table.insertBefore(document.body.firstChild);

//show result
var loop=setInterval(function callback(){
	result_table.html("<tr><td>" + result_table.text() + ".</td></tr>");
	if(count_ajax==page_count){
		result_table.html("<tr><td>" + result_table.text() + "完成</td></tr>");

		//transfer object to array and sort
		var result_array = [];
		for(var prop in count_result){
			result_array.push([prop, count_result[prop]]);
		}
		result_array.sort(function(a, b) {return b[1] - a[1]});

		var result = "";
		for(var i=0;i<result_array.length;i++){
			result += "<tr><><td width=20>" + result_array[i][1] + "</td><td>" + result_array[i][0] + "</td></tr>\n";
		}
		result_table.html("<tr><td colspan=2>" + result_table.text() + "</td></tr>" + result);

		clearInterval(loop);
	}
},1000);
