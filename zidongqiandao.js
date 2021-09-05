function cx_sign(isReload=true) {
    if (AutoSignConfig.CX_IsOpen) {
        console.log("%c【超星·主页签到】%c功能已%c开启", "color:red", "color:black", "background-color:green;color:white;");
    } else {
        console.log("%c【超星·主页签到】%c功能已%c关闭", "color:red", "color:black", "background-color:red;color:white;");
        return;
    }
    var getwaittingtime = function(time1,time2) {
        return Math.floor((Math.random() * (time2-time1)) + time1) - 1;
    };
    var wait4time= Number(AutoSignConfig.CX_WaitingTime);
    var wait_format = (parseInt(wait4time / 60) ? (parseInt(wait4time / 60) + "分钟") : "") +
        (parseInt(wait4time % 60) ? parseInt(wait4time % 60) + "秒" : "");
    console.group("$$课程信息$$（点我收起/展开）");
    console.log("一共有%c" + $(".courseItem.curFile").length + "%c门课程:", "color:blue", "color:black");
    window.T2S("签到插件开启，一共有" + $(".courseItem.curFile").length + "门课程。中心监视时长，" + wait_format +( AutoSignConfig.CX_IsRandomWaiting?",允许":"不允许")+"随机正负5秒范围内偏移。");
    box("超星签到脚本开启成功","一共有" + $(".courseItem.curFile").length + "门课程。\n中心监视时长，"
        + wait_format+"\n" +( AutoSignConfig.CX_IsRandomWaiting?",允许":"不允许")+"随机正负5秒范围内偏移。");
    var echo_number=0;
    if(isReload){
        $(".courseItem.curFile").each(function(inumber,obj) {
            setTimeout(function() {
                inumber+=1;
                var coursename = obj.children[3].children[0].children[0].innerText;
                var courseID = obj.children[0].value;
                var classID=obj.children[1].value;
                console.log("No\t%s:\n专业:%c%s\n%ccourseID:%c" + courseID + "\n%cclassID为：%c" + classID,inumber, "color:red", coursename, "color:black", "color:red", "color:black", "color:red");
                var sign_url = "http://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=" + courseID + "&coursename=" + b64en(coursename) + "&jclassId=" + classID;
                var tmp = document.createElement("iframe");
                tmp.id = 'loginframe_' + courseID;
                tmp.src = sign_url;
                tmp.style = "display:none;width: 0px;height: 0px;position: fixed;left: 0px;bottom: 0px;z-index: -99;";
                $("body")[0].append(tmp);
                echo_number=inumber;
            },10);
        });
    }
    var mytInterval=setInterval(function() {
        if(echo_number==$(".courseItem.curFile").length){
            console.groupEnd("$$课程信息$$（点我收起/展开）");
            clearInterval(mytInterval);
        }
    },10);
}

function cx_main() {
    if (!AutoSignConfig.CX_IsOpen) { //关闭主页自动签到
        return;
    }
    var getwaittingtime = function(time1,time2) {
        return Math.floor((Math.random() * (time2-time1)) + time1) - 1;
    };
    var wait4time=0;
    if(!AutoSignConfig.CX_IsRandomWaiting){
        wait4time= Number(AutoSignConfig.CX_WaitingTime);
    }else{
        wait4time= Number(AutoSignConfig.CX_WaitingTime);
        wait4time=getwaittingtime(wait4time-5,wait4time+5);
    }
    if(wait4time<=1){
        wait4time=5;
    }
    var wait_format = (parseInt(wait4time / 60) ? (String(parseInt(wait4time / 60)) + "分钟") : "") +
        (String(parseInt(wait4time % 60)) ? String(parseInt(wait4time % 60)) + "秒" : "");
    wait4time*=1000;
    var coursename = "";
    try {
        coursename = location.href.match(/coursename=[A-Za-z0-9/\+=]+/g)[0].substring(11);
    } catch (e) {
    }
    var waitingTimes = location.href.match(/tao_auto_refresh_time=\d+/g),
        MAX_waittingTimes = Number(AutoSignConfig.CX_MaxWaitingCount);
    waitingTimes = Number((waitingTimes === null) ? 0 : waitingTimes[0].match(/\d+/g)[0]);
    waitingTimes++;
    try {
        if ($(".qdhover").length !== 0) {
            var getmsg = $(".qdhover").parent().parent().parent()[0].getAttributeNode("onclick").nodeValue.match(/\d+/g);
            if (getmsg[1] == 2) { //普通签到
                var activeId = getmsg[0];
                var courseId = $("#courseId").val();
                var classId = $("#classId").val();
                var fid = $("#fid").val();
                var url = "/widget/sign/pcStuSignController/signIn?activeId=" + activeId + "&classId=" + classId + "&coursename=" + coursename + "&fid=" + fid + "&courseId=" + courseId;
                var tmp = document.createElement("iframe");
                tmp.id = 'loginframe';
                tmp.src = url;
                tmp.style = "display:none;width: 0px;height: 0px;position: fixed;left: 0px;bottom: 0px;z-index: -99;";
                $("body")[0].append(tmp);
                $("#loginframe").load(function() {
                    if (window.frames[0].$("title")[0].text.match("成功") !== "") {
                        if (top.location == self.location) {
                            window.T2S("当前课程，签到成功");
                            box("超星签到！","当前课程，签到成功");
                            console.log("%c【当前课程】签到成功!", "color:white;font-size:30px;background-color:green");
                            $(".qdhover").parent().parent().parent().children().children()[1].innerHTML += "<font style='color:white;font-size:30px;background-color:green;line-height: 30px;'> 签到成功！</font>";
                            $(this).remove();
                        } else {
                            window.T2S(b64de(coursename) + "，签到成功");
                            console.log("%c【%s】签到成功!", "color:white;font-size:30px;background-color:green", b64de(coursename));
                        }
                    } else {
                        if(!box("超星签到！","未知错误！请手动签到！")){
                            alert("未知错误！请手动签到！");
                        }
                        window.T2S("未知错误！请手动签到！");
                    }
                });
            } else { //不支持
                if(!box("警告！签到模式不支持！","【" + top.location == self.location ? "当前课程" : b64de(coursename) + "】\n出现非支持签到模式！请手动签到！！！",60)){
                    alert("【" + top.location == self.location ? "当前课程" : b64de(coursename) + "】出现非支持签到模式！请手动签到！！！");
                }
                window.T2S(top.location == self.location ? "当前课程" : b64de(coursename) + ",出现非支持签到模式！请手动签到！！！");
            }
        } else {
            if (MAX_waittingTimes && waitingTimes >= MAX_waittingTimes) {
                window.T2S(top.location == self.location ? "当前课程" : b64de(coursename) + "已达尝试上限" + String(MAX_waittingTimes) + "次，已停止");
                console.log("%c【%s】%c已达尝试上限%s次，已停止", "color:red", top.location == self.location ? "当前课程" : b64de(coursename), "color:black", String(MAX_waittingTimes));
                return;
            } else {
                console.log("%c【%s】%c第" + String(waitingTimes) + "次尝试，\n暂无签到任务，%s后自动再次尝试", "color:red", (top.location == self.location ? "当前课程" : b64de(coursename)), "color:black", wait_format);
                setTimeout(function() {
                    window.location.href = location.href.indexOf("tao_auto_refresh_time") > -1 ? (location.href.replace(new RegExp("tao_auto_refresh_time=\\d+", 'g'), "tao_auto_refresh_time=" + waitingTimes)) : (location.href + (location.href.indexOf("?") > -1 ? "&" : "?") + "tao_auto_refresh_time=" + waitingTimes);
                }, wait4time);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

