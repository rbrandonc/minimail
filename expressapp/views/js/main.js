
      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '18435273169-p4jgof3ai0iv9705e12t04obphi0oqsc.apps.googleusercontent.com';

      var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];



      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        if(gapi.auth){
          console.log("gapi");
          gapi.auth.authorize(
            {
              'client_id': CLIENT_ID,
              'scope': SCOPES.join(' '),
              'immediate': true
            }, handleAuthResult);
        }
        else{
          console.log("no gapi");
        }
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadGmailApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Gmail API client library. List labels once client library
       * is loaded.
       */
      function loadGmailApi() {
        gapi.client.load('gmail', 'v1', displayInbox);
        //gapi.client.load('gmail', 'v1', getMessages);
      }

      //Message click handler
      $(document).delegate("td", "click", function(){
        console.log("clicked");
          var id = $(this).attr('id');
          console.log(id);
          var messageRequest = gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': id
          });

          messageRequest.execute(getBody);
          //console.log(messageRequest);
      });

      /**
       * Print all Labels in the authorized user's inbox. If no labels
       * are found an appropriate message is printed.
       */
      function listLabels() {
        // var request = gapi.client.gmail.users.labels.list({
        //   'userId': 'me'
        // });

        // request.execute(function(resp) {
        //   var labels = resp.labels;
        //   appendPre('Labels:');
        //   //console.log(labels);
        //   if (labels && labels.length > 0) {
        //     for (i = 0; i < labels.length; i++) {
        //       var label = labels[i];
        //       appendPre(label.name)
        //     }
        //   } else {
        //     appendPre('No Labels found.');
        //   }
        // });
      }

      function displayMessage(message){

        //var decodedmessage = Base64.decode(message.raw);
          //console.log("Decoded: " + decodedmessage);

          $('#selectedmessage').html("clicked " + message.id + "!");
      }

      function getBody(message) {
        $('#selectedmessage').html("clicked " + message.id + "!");
        //console.log(message);
        var encodedBody = '';
        if(typeof message.payload.parts === 'undefined')
        {
          encodedBody = message.payload.body.data;
        }
        else
        {
          encodedBody = getHTMLPart(message.payload.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');

        var doc = document.getElementById('selectedmessage').contentWindow.document;
        doc.open();
        doc.write(decodeURIComponent(escape(window.atob(encodedBody))));
        doc.close();
        
      }

      function getHTMLPart(arr) {
        for(var x = 0; x <= arr.length; x++)
        {
          if(typeof arr[x].parts === 'undefined')
          {
            if(arr[x].mimeType === 'text/html')
            {
              return arr[x].body.data;
            }
          }
          else
          {
            return getHTMLPart(arr[x].parts);
          }
        }
        return '';
      }

      function displayInbox() {
        var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'INBOX',
          'maxResults': 100
        });

        request.execute(function(response) {
          $.each(response.messages, function() {
            var messageRequest = gapi.client.gmail.users.messages.get({
              'userId': 'me',
              'id': this.id
            });

            messageRequest.execute(appendMessageRow);
          });
        });

      }

      function appendMessageRow(message) {
        //<td class = "from">'+getHeader(message.payload.headers, 'From')+'</td>\
        //<td class = "date">'+getHeader(message.payload.headers, 'Date')+'</td>\
        console.log(message);
        $('#messagelist').append(
          '<tr>\
            <td class = "subject" id = "'+message.id+'">'+getHeader(message.payload.headers, 'Subject')+'</td>\
          </tr>'
        );
        $('#scrollbar1').data().plugin_tinyscrollbar.update();
          //console.log("up");
      }

      // function getMessages(){
      //   // var request = gapi.client.gmail.users.messages.list({
      //   //   'userId': 'me',
      //   //   'labelIds': 'INBOX',
      //   //   'maxResults': 5
      //   // });

      //   var request = gapi.client.gmail.users.messages.get({
      //             'userId': 'me',
      //             'id': "159b7d780fed379d"
      //           });

      //   request.execute(function(resp) {
      //     // var messages = resp.messages;
      //      console.log(request);

      //     // request.execute(function(response) {
      //     //   $.each(response.messages, function() {
      //     //     var request2 = gapi.client.gmail.users.messages.get({
      //     //         'userId': 'me',
      //     //         'id': "159b7d780fed379d"
      //     //       });

      //     //     console.log(request2);
      //     //   });
      //     // });
      //   });
      // }

      function getHeader(headers, index) {
        var header = '';
        $.each(headers, function(){
          if(this.name === index){
            header = this.value;
          }
        });
        return header;
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      // function appendPre(message) {
      //   var pre = document.getElementById('output');
      //   var textContent = document.createTextNode(message + '\n');
      //   pre.appendChild(textContent);
      // }

      // function appendMessage(message) {
      //   var pre = document.getElementById('messagelist');
      //   var textContent = document.createTextNode(message + '\n');
      //   pre.appendChild(textContent);
      // }