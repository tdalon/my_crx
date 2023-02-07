// Commands
chrome.commands.onCommand.addListener(function (command) {
switch (command) {
	case "share2teams": // Goodreads Amazon to Goodreads
		Share2Teams();
		return;
	case "GoodreadsEdit": // Goodreads Amazon to Goodreads
		GoodreadsEdit();
		return;
					
} // end switch

}); // end command.addListener

function CrxHelp(){
// Open CRX Help
window.open("https://github.com/tdalon/my_crx/blob/main/README.md"); 
}

function CrxRn(){
// Open Crx Release Notes
window.open("https://github.com/tdalon/my_crx/blob/main/Changelog.md");
}

function Share2Teams(){
chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
url = tabs[0].url;
re= /[&|\?]lang=[\w\-_]+(#!)?/;
url = url.replace(re, "");
//url = url.replace("?","%3F");
//url = url.replace(new RegExp("?", 'g'), "%3F");
window.open('https://teams.microsoft.com/share?href=' + url + '%2F&referrer=Share to Microsoft Teams','ms-teams-share-popup', 'width=700,height=600');	
});
} // eofun Share2Teams

function Amazon2Goodreads(){
chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
url = tabs[0].url;
re = /amazon\..*\/dp\/([A-Z0-9]*)/;
var found = url.match(re);
if (found == null) {
	alert('Sorry, this doesn\'t appear to be an Amazon book page.'); 
	return;
} 
window.open('https://www.goodreads.com/search?q='+ found[1]);

});
} // eofun Amazon2Goodreads

function GoodreadsEdit(){
chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
url = tabs[0].url;
re = /goodreads\.com\/book\/show\/([A-Z0-9]*)/;
var found = url.match(re);
if (found == null) {
	alert('Sorry, this doesn\'t appear to be a Goodreads book page.'); 
	return;
} 
window.open('https://www.goodreads.com/review/edit/'+ found[1]);

});
} // eofun GoodreadsEdit


// Context menus
// Top level Number limited to 6
chrome.contextMenus.removeAll();

chrome.contextMenus.create({
	id: "my_crx_help",
	title: "Help",
	contexts: ["browser_action"]
});

/* chrome.contextMenus.create({
	id: "my_crx_rn",
	title: "Release Notes",
	contexts: ["browser_action"]
}); */


//  Add separator
chrome.contextMenus.create({
	id:"nws_crx_sep1",
	type: "separator",
	contexts: ["browser_action"]
});


// Share To Teams
chrome.contextMenus.create({
	id: "my_crx_share2teams",
	title: "Share to Teams",
	contexts: ["browser_action"]
});
  

/* //  Add separator
chrome.contextMenus.create({
	id:"nws_crx_sep2",
	type: "separator",
	contexts: ["browser_action"]
}); */

// Goodreads
chrome.contextMenus.create({
	title: "Goodreads",
	id: "goodreads",
	contexts:["browser_action"]
  });
chrome.contextMenus.create({
	id: "my_crx_az2gr",
	parentId:"goodreads",
	title: "Amazon to Goodreads",
	contexts: ["browser_action"]
});

chrome.contextMenus.create({
	id: "my_crx_gre",
	parentId:"goodreads",
	title: "Goodreads Edit Book",
	contexts: ["browser_action"]
});


// Add Context Menu listener
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "my_crx_help": 
			CrxHelp();
			return;
		case "my_crx_rn": 
			CrxRn();
			return;
		case "my_crx_share2teams":
			Share2Teams();
			return;
		case "my_crx_az2gr":
			Amazon2Goodreads();
			return;
		case "my_crx_gre":
			GoodreadsEdit();
			return;
		default:
			return
					 
	} // end switch

});

	
// #START
chrome.omnibox.onInputEntered.addListener(
    function (searchStr) {

// if user enters a keyword after the omnibox keyword, redirect search to different destination
var splitText = searchStr.split(' ');
var firstWord = splitText[0];

if (firstWord == "-h") {
	CrxHelp();
	return
}

if (firstWord == "-r") {
	CrxRn();
	return
}

// shortlinks
if (firstWord == "l") {
	var secondWord = splitText[1];
	if (secondWord == "mb") {
		sUrl = "https://tdalon.blogspot.com/";
	} else if (secondWord == "gh") {
		sUrl = "https://github.com/tdalon/ahk";
	} else if (secondWord == "gi") {
		sUrl = "https://gist.github.com/tdalon";
	} else if (secondWord == "pt") {
		sUrl = "https://tdalon.github.io/ahk/PowerTools";
	} else if (secondWord == "yt") {
		sUrl = "https://www.youtube.com/";
	} else {
		sUrl = "https://links.toto.de/" + secondWord ; // TODO
	}
	var thirdWord = splitText[2];
	if (thirdWord == null) {
		window.open(sUrl);
	} else if (thirdWord == "-c") {
		copyTextToClipboard(sUrl);
		closeCurrentTab();
	}
	return;
}

if (firstWord == "#test") {
	const data = new Blob(['<div>test</div>'], {type: 'text/html'})
	const item = new ClipboardItem({'text/html': data});
	navigator.clipboard.write([item]);
	return
}

switch (firstWord.toLowerCase()) {
	case 'gr+': // Goodreads Amazon to Goodreads
		closeCurrentTab();
		Amazon2Goodreads();
		return;
	case 'gr':
			searchStr = searchStr.substring(firstWord.length + 1);	
			if (searchStr == null) {
				sUrl = "https://www.goodreads.com" ;
				chrome.tabs.update({ url: sUrl });
			} else {
				searchGoodreads(searchStr);
			}
			return;
	case 'cal':
		sUrl = "https://calendar.google.com/calendar/u/0/r";
		chrome.tabs.update({ url: sUrl });
		return;
	case 'gm':
	case 'mail':
		sUrl = "https://mail.google.com/mail/ca/u/0/";
		chrome.tabs.update({ url: sUrl });
		return;
	case 'so': // stackoverflow
		searchStr = searchStr.substring(firstWord.length + 1);	
		searchStackOverflow(searchStr);
		return;
	case 'g': // google
	case 'go':
		searchStr = searchStr.substring(firstWord.length + 1);	
		if (searchStr == null) {
			sUrl = "https://www.google.com" ;
		} else {
			sUrl = "https://www.google.com/search?q=" + searchStr;
		}
		chrome.tabs.update({ url: sUrl });
		return;
	case 'tw': // twitter
		searchStr = searchStr.substring(firstWord.length + 1);	
		if (searchStr == null) {
			sUrl = "https://twitter.com/tdalon" ;
		} else {
			searchStr = searchStr.replaceAll("#","%23");
			sUrl = "https://twitter.com/search?q=" + searchStr;
		}
		chrome.tabs.update({ url: sUrl });
		return;
	case 'mb': // my blog
		searchStr = searchStr.substring(firstWord.length + 1);
		sUrl = "https://tdalon.blogspot.com";
		searchBlogger(sUrl, searchStr);
		return
	case 'nb': // new blog post - blogger dashboard
		sUrl = "https://draft.blogger.com/blogger.g?blogID=7106641098407922697#overview/src=dashboard";
		chrome.tabs.update({ url: sUrl });
		return
	case 'p': // profiles by name
	case 'li': // profiles by name - LinkedIn
		var secondWord = splitText[1];
		if (secondWord == null) {
			sUrl = "https://www.linkedin.com/in/tdalon/";
		} else if (secondWord == "-c") {
			sUrl = "https://www.linkedin.com/in/tdalon/";
			copyTextToClipboard(sUrl);
			closeCurrentTab();
			return
		} else if (secondWord == "j") {
			sUrl = "https://www.linkedin.com/jobs/"
		} else if (secondWord == "mj") {
			sUrl = "https://www.linkedin.com/my-items/saved-jobs/"
		} else {
			searchStr = searchStr.substring(firstWord.length + 1);
			sUrl = "https://www.linkedin.com/search/results/people/?keywords=" + searchStr;
		}
		break;
	case 'yt':
	case 'youtube':
		searchStr = searchStr.substring(firstWord.length + 1);	
		if (searchStr == "") {
			sUrl = "https://www.youtube.com/c/ThierryDalon" ;
		} else {
			sUrl = "https://www.youtube.com/results?search_query=" + searchStr;
		}
		break;
	case 'pt':
		var secondWord = splitText[1];
		if (secondWord == null) {
			sUrl = "https://tdalon.github.io/ahk/PowerTools";
			chrome.tabs.update({ url: sUrl });
			return;
		} else if (secondWord == "-c") {
			sUrl = "https://tdalon.github.io/ahk/PowerTools";
			copyTextToClipboard(sUrl);
			closeCurrentTab();
			return
		} 

		switch (secondWord) {
			case 'teamsy':
			case 'ty':
				sUrl = "https://tdalon.github.io/ahk/Teamsy";
				break;
			case 'tl':
				sUrl = "https://tdalon.github.io/ahk/Teamsy-Launcher";
				break;
			case 'ts':
				sUrl = "https://tdalon.github.io/ahk/Teams-Shortcuts";
				break;
			case 'mu':
			case 'mute':
				sUrl = "https://tdalon.github.io/ahk/Mute-PowerTool";
				break;
			case 'cy':
				sUrl = "https://tdalon.github.io/ahk/Chromy";
				break;
		}

		var thirdWord = splitText[2];
		if (thirdWord == null) {
			chrome.tabs.update({ url: sUrl });
		} else if (thirdWord == "-c") {
			copyTextToClipboard(sUrl);
			closeCurrentTab();
		}
	default:
		return
		     
} // end switch


chrome.tabs.update({ url: sUrl });
});


String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

function prepSearchString(searchText) {
	return encodeURIComponent(searchText)
};



// Copied from search.js by nws_search.xlsm
// Library of common search functions


// ----------------------------------------------------------------------------------------------------------
function closeCurrentTab(){
// Close current tab and browser window if last tab
// chrome.tabs.remove will not close the window on last tab closure -> needs to check if single tab opened
chrome.tabs.query({
	//active: true,
	currentWindow: true
}, function(tabs)	{
	if (tabs.length > 1) {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs)	{
		chrome.tabs.remove(tabs[0].id, function() { });
		});
	} else {
		chrome.windows.getCurrent(function(win) {
			chrome.windows.remove(win.id, function() { });
		});
	}		
});
} // eofun

// ----------------------------------------------------------------------------------------------------------
// https://stackoverflow.com/a/18455088/2043349
function copyTextToClipboard(text) {
	//Create a textbox field where we can insert text to. 
	var copyFrom = document.createElement("textarea");
  
	//Set the text content to be the text you wished to copy.
	copyFrom.textContent = text;
  
	//Append the textbox field into the body as a child. 
	//"execCommand()" only works when there exists selected text, and the text is inside 
	//document.body (meaning the text is part of a valid rendered HTML element).
	document.body.appendChild(copyFrom);
  
	//Select all the text!
	copyFrom.select();
  
	//Execute command
	document.execCommand('copy');
  
	//(Optional) De-select the text using blur(). 
	//copyFrom.blur();
  
	//Remove the textbox field from the document.body, so no other JavaScript nor 
	//other elements can get access to this.
	document.body.removeChild(copyFrom);
} // eofun

// ----------------------------------------------------------------------------------------------------------
function SearchMSHelp(id,searchStr) {

	if (searchStr.length==0) {
		sUrl = nws_map[id]["ms_helpcenter"]; 
		if (sUrl === "") {return;}
		chrome.tabs.update({ url: sUrl });
		return;
	}
	if (id=="ms_power_bi") {
		sUrl = "https://powerbi.microsoft.com/search/documentation/" + "?q=" + searchStr;
	} else {
		sUrl = "https://support.microsoft.com/search/results" + "?query=" + searchStr + " " + nws_map[id]["text"]; 
		sUrl = sUrl.trim();
	}
	chrome.tabs.update({ url: sUrl });
}
// eofun
// ----------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------
function cleanUrl(sUrl) {
// Cleanup Connections url
	re= /[&|\?]lang=[\w\-_]+(#!)?/;
	sUrl = sUrl.replace(re, '');
	sUrl = sUrl.replace('index&tag=', 'index?tag=');
	sUrl = sUrl.replace('&section=','?section=');

	return sUrl

} // eofun



// -------------------------------------------------------------------

function searchGoodreads(searchStr){
	sSearchRootUrl = "https://www.goodreads.com/review/list/4083745-thierry-dalon?"
	patt = /#[^\s#]*/g;
	arrMatch = searchStr.match(patt);
	var sTags;
	if (arrMatch !== null){
		for (var i= 0;i<arrMatch.length;i++){
			var tag=arrMatch[i];
			tag=tag.slice(1); // remove trailing #		
			if (i===0) {
				sTags = "&shelf=" + tag;
			} else {
				sTags= sTags + "%2C" + tag;
			}
		}// end for tag array			
		searchStr = searchStr.replace(patt,"");
	}
	searchStr = searchStr.trim();
	
	if (searchStr.length>0){ // search with keywords
		sUrl = sSearchRootUrl  + "&search%5Bquery%5D=" + searchStr
		//sSearch := StrReplace(sSearch," ","+")
		//if  (sTags !== undefined){
		//	searchStr = searchStr + "+" + sTags  ;
		//} 
	}	else {
		sUrl = sSearchRootUrl + sTags;
	}
	
	
	chrome.tabs.update({ url: sUrl });

} // end function searchGoodreads

// -------------------------------------------------------------------

function searchStackOverflow(searchStr){
	sUrl = "https://stackoverflow.com/"
	if (searchStr.length === 0){
		chrome.tabs.update({ url: sUrl  });
		return;
	}
	
	patt = /#[^ ]*/g;
	arrMatch = searchStr.match(patt);
	var sTags;
	if (arrMatch !== null){
		for (var i= 0;i<arrMatch.length;i++){
			var tag=arrMatch[i];
			tag=tag.slice(1); // remove trailing #		
			tag= tag.replace("&","%26");
			if (i===0) {
				sTags = "[" + tag + "]";
			} else {
				sTags= sTags + " [" + tag + "]";
			}
		}// end for tag array			
		searchStr = searchStr.replace(patt,"");
	}
	searchStr = searchStr.trim();
	searchStr = sTags + " " + searchStr
	searchStr = searchStr.trim();
	
	sUrl = sUrl + "/search?q=" + searchStr;
	
	chrome.tabs.update({ url: sUrl });
} // end function searchStackOverflow



// -------------------------------------------------------------------

function searchBlogger(sUrl,searchStr){
	if (searchStr.length === 0){
		chrome.tabs.update({ url: sUrl });
		return;
	}
	
	patt = /#[^ ]*/g;
	arrMatch = searchStr.match(patt);
	var sTags;
	if (arrMatch !== null){
		for (var i= 0;i<arrMatch.length;i++){
			var tag=arrMatch[i];
			tag=tag.slice(1); // remove trailing #		
			tag= tag.replace("&","%26");
			if (i===0) {
				sTags = "label:" + tag;
			} else {
				sTags= sTags + "+label:" + tag;
			}
		}// end for tag array			
		searchStr = searchStr.replace(patt,"");
	}
	searchStr = searchStr.trim();
	
	// copy to clipboard option
	patt = /\s*-c\s*/g;
	arrMatch = searchStr.match(patt);
	var copyToClipboard = (arrMatch !== null);
	if (copyToClipboard == true) {
		searchStr = searchStr.replace(patt,"");		
	} // eoif
	
	if (searchStr.length>0){ // search with keywords
		//sSearch := StrReplace(sSearch," ","+")
		if  (sTags !== undefined){
			searchStr = searchStr + "+" + sTags  ;
		} 
	}	else {
		searchStr = sTags
	}
	sUrl = sUrl + "/search?q=" + searchStr;
	sUrl = sUrl + "&max-results=500";
	
	if (copyToClipboard == true) {
		copyTextToClipboard(sUrl);
		closeCurrentTab();
		
	} else {
		chrome.tabs.update({ url: sUrl });
	}
} // end function searchBlogger


// -------------------------------------------------------------------
function createBlogger(sUrl) {
	sBlogId = "7106641098407922697";
	sUrl = "https://draft.blogger.com/blogger.g?blogID=" + sBlogId + "#overview/src=dashboard";
	chrome.tabs.update({ url: sUrl });
} // end function createBlogger
// End Copied from search.js by nws_search.xlsm