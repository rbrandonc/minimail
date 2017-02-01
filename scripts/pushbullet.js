var PushBullet = {

    APIKey	: null,

    user : function(){

        var push = new XMLHttpRequest();
        push.open("GET", "https://api.pushbullet.com/v2/users/me", false);
		push.setRequestHeader("Authorization", "Basic " + window.btoa(this.APIKey + ":"));
        push.setRequestHeader("Content-Type", "application/json");
        push.send();

        return JSON.parse(push.response);

    },

    sendSMS : function() {
    	var text = {
        data: {
          target_device_iden: "ujC5qmMtLFIsjAiVsKnSTs",
          addresses: "336 290 3328",
          guid: "ujC5qmMtLFIsjAiVsKnSTs",
          message: "test",
        }
      };


    var ref, xhr;

    xhr = new XMLHttpRequest();
    xhr.open('POST', "https://api.pushbullet.com/v3/create-text");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Authorization", "Basic " + btoa("o.r6MVZUniNq1K3QjzZbRTIqynIrzIXAt4" + ":"));
    return xhr.send(JSON.stringify(text));
  },

    getDevices : function(){
    	var push = new XMLHttpRequest();
        push.open("GET", "https://api.pushbullet.com/v2/devices", false);
		push.setRequestHeader("Authorization", "Basic " + window.btoa(this.APIKey + ":"));
        push.setRequestHeader("Content-Type", "application/json");
        push.send();

        return JSON.parse(push.response);
    }

};

/*{
  "push": {
    "conversation_iden": "+1 336 290 3328",
    "message": "Hello!",
    "package_name": "com.pushbullet.android",
    "source_user_iden": "ujC5qmMtLFI",
    "target_device_iden": "ujC5qmMtLFIsjAiVsKnSTs",
    "type": "messaging_extension_reply"
  },
  "type": "push"
}*/