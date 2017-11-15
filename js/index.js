$(function() {

  console.log('In the index.js page');

  // Our interface to the Chat service
  var chatClient;

  // A handle to the "general" chat channel - the one and only channel we
  // will have in this sample app
  var generalChannel;


// Get an access token for the current user, passing a username (identity)
  // and a device ID - for browser-based apps, we'll always just use the
  // value "browser"
  $.getJSON('/token', {
    device: 'browser'
  }, function(data) {

    // Initialize the Chat client
    let clientOptions = { logLevel: 'debug' };
    //let chatClient = new Twilio.Chat.Client(token, clientOptions);
      chatClient = new Twilio.Chat.Client(data.token);
      chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);
 
 });

  function createOrJoinGeneralChannel() {
    // Get the general chat channel, which is where all the messages are
    // sent in this simple application
    //print('Attempting to join "API.ai" chat channel...');
    console.log('About to join bot_channel');
    var promise = chatClient.getChannelByUniqueName('bot_channel');
    promise.then(function(channel) {
      generalChannel = channel;
      console.log('Found bot_channel channel:');
      console.log(generalChannel);
      setupChannel();
    }).catch(function() {
      // If it doesn't exist, let's create it
      console.log('Creating general channel');
      chatClient.createChannel({
        uniqueName: 'general',
        friendlyName: 'General Chat Channel'
      }).then(function(channel) {
        console.log('Created general channel:');
        console.log(channel);
        generalChannel = channel;
        setupChannel();
      });
    });
  }

  // Set up channel after it has been found
  function setupChannel() {
    // Join the general channel
    generalChannel.join().then(function(channel) {
      //print('Joined channel as '
      //+ '<span class="me">' + username + '</span>.', true);
      //dfapp.textRequest('can you help me');
    });
  }

// Send a new message to the general channel
  var $input = $('#chat-input');
  $input.on('keydown', function(e) {
    if (e.keyCode == 13) {
      generalChannel.sendMessage($input.val())
      $input.val('');
    }
  });
  
});