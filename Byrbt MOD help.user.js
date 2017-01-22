// ==UserScript==
// @name         Byrbt MOD help
// @namespace    http://blog.rhilip.info
// @version      20161227
// @description  It's an userscript prepared for uesrs who's Level is highter than Moderator in Byrbt
// @author       Rhilip
// @match        http*://bt.byr.cn/*
// @icon         http://bt.byr.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/My-Web-help/raw/master/Byrbt%20MOD%20help.user.js
// @grant        none
// ==/UserScript==

// == Control Options ==
// If no other description, 1 means on ,0 means off.
var IPv6toLoc = 1;   //Change IPv6 address to Location in page detail.php and viewsnatches.php
var SubCheck = 1;    //Need to fix!!!!
var quickResp = 0;   //Prepare to wrtie!!!!
// Other changes in page detail.php
var hideComment = 0; //Hide comment.
// ==/ Control Options ==

//Global Variables
var myName = $("table#info_block > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > span > a > b").text();
var replyBox = $("textarea#quickreply");

//prepare part
function trueIp(ip) {
    return ip.match(/(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/) || ip.match(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/);      //Check IPv4 or IPv6 address
}

//Main part
$(document).ready(function(){
    //Change IPv6 address
    if(IPv6toLoc){
        //In page detail.php
        if (location.pathname == "/details.php"){
            $('span#hidepeer > a').after('<br><a id="toloc" class="sublink">[地点查询]</a>');
            $('a#toloc').click(function(){
                $("div#peerlist > table > tbody > tr > td:nth-child(1) > br").remove();                 //Display Peer's name in a row,Please Make sure you NEED or not!
                var maintable = $('div#peerlist > table > tbody > tr > td:nth-child(2)');
                maintable.each(function(){
                    var node = $(this);
                    var ip = node.text();
                    if (trueIp(ip)){
                        var url='http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                        $.getJSON(url,function(data){
                            node.text(data.geo.loc);
                            node.attr("title",data.geo.ip);
                        });
                    }
                    node.attr("width","9%");
                });
            });
        }
        //In page viewsnatches.php and iphistory.php(Automatically)
        if (location.pathname == "/viewsnatches.php" || location.pathname == "/iphistory.php"){
            var maintable = $("td#outer > table.main > tbody > tr > td > table > tbody > tr > td:nth-child(2)");
            maintable.each(function(){
                var node = $(this);
                var ip = node.text();
                if (trueIp(ip)){
                    var url='http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                    $.getJSON(url,function(data){
                        if (location.pathname == "/viewsnatches.php"){
                            node.html(ip +"<br>"+ "(" +data.geo.loc + ")");
                        }else if(location.pathname == "/iphistory.php"){
                            node.after("<td align='center'>"+data.geo.loc+"</td>");
                        }
                    });
                }else{
                    if (location.pathname == "/viewsnatches.php"){
                        node.text("IP/地点");
                    }else if(location.pathname == "/iphistory.php"){
                        node.parents("table:eq(0)").attr("width","600");
                        node.after('<td class="colhead" align="center" width="30%">地点</td>');
                    }
                }
            });
        }
    }

    if(quickResp){
        replyBox.val();
    }

    //Make the input box in page report.php Wider
    $('td#outer > table.main > tbody > tr > td > table > tbody > tr > td > form > input[type="text"]').attr("style","width: 400px");

    //Show subtitles corrensponding torrent's link,and check It's status (exist or not)
    if(SubCheck && location.pathname == "/subtitles.php"){
        //Add form columns
        $("td#outer > table > tbody > tr:nth-child(1) > td.colhead:eq(1)").after('<td class="colhead" id="check">对应种子</td>');
        $("td#outer > table > tbody > tr").each(function(){
            var tr =$(this);
            if(tr.find('td:nth-child(2) > a').length){
                var torrentid = tr.find('a[href^="downloadsubs.php?torrentid"]').attr('href').match(/torrentid=(\d+)/)[1];
                tr.find('td[align=left]').after('<td class="rowfollow" align="center"><a id="status" target="_blank" href="/details.php?id='+ torrentid +'&hit=1">'+ torrentid +'</a></td>');
                /**Seems to often miscarriage of Justice (Need to fix)
                 var info = $("a#status");
                $.get('/details.php?id='+ torrentid +'&hit=1',function (resp) {
                    if(resp.match(/<td[^>]*>[\u6ca1\u6709\u8be5\u0049\u0044\u7684\u79cd\u5b50\u000d\u000a]*<\/td>/gi)){     //<td class="text">没有该ID的种子</td>
                        info.attr("title",torrentid).text("种子不存在");
                    }
                });
                */
            }
        });
    }

    //High yourself in page uploaders.php
    if(location.pathname == "/uploaders.php"){
        var table = $("td#outer > table.main > tbody > tr > td > div > div > table > tbody");
        table.find("tr > td:nth-child(1) > span > a").after("<br />");
        //High yourself
        table.find("tr:contains('"+ myName +"')").attr("class","free_bg");
    }

    //Other change in page details.php
    if(location.pathname == "/details.php"){

        var commentArea = $("td#outer > table.main:last");

        if(giveOtherBones){

        }

        if(hideComment){      //Discussion on page http://bt.byr.cn/forums.php?action=viewtopic&topicid=10717
            commentArea.before('<input class="btn" type="button" id="showButton" value="显示评论">').hide();
            $('input#showButton').click(function(){
                commentArea.toggle();
                $('input#showButton').remove();
            });
        }
    }
});