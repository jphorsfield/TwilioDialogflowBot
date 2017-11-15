<a href="https://www.twilio.com">
  <img src="https://www.seeklogo.net/wp-content/uploads/2013/06/vodafone-plc-vector-logo-400x400.png" alt="Twilio" width="150" />
</a>
<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="150" />
</a>
<a href="https://www.twilio.com">
  <img src="https://1.bp.blogspot.com/-BmeQyJ-0GuU/Wd0LadZyRrI/AAAAAAAAD-Q/c2EAfIPRgZkqsQ55kuphuWoM6qhOKmj5ACLcBGAs/s1600/image1.png" alt="Dialogflow" width="170"/>
</a>

# Twilio - Dialogflow Chat Application (Node.js)

This project demonstrates how to combine Twilio and Dialogflow in a Node.js web
application. The principle concept is to integrate a chat service with a language model.

Let's get started!

## Configure the application

To run the application, you'll need to gather the AllHandsDemo Twilio account credentials and configure them in a file named `.env`. The correct settings can be provided to you, the example `.env` file needs to be populated, from the command prompt execute the following

```bash
cp .env.example .env
```

### Configure account information

Every sample in the demo requires some basic credentials from your Twilio account. Configure these first.

| Config Value  | Description |
| :-------------  |:------------- |
`TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier
`TWILIO_API_KEY` | Used to authenticate
`TWILIO_API_SECRET` | Used to authenticate 

### Configuring Twilio Chat

In addition to the above, you'll need to use the Chat Service SID in the Twilio Console. Put the result in your `.env` file.

| Config Value  | Where to get one. |
| :------------- |:------------- |
`TWILIO_CHAT_SERVICE_SID` | Chat |

## Run the sample application

All of the necessary modules are in the package.json file however make sure that the following has been done

```bash
npm install twilio
npm install fb-watchman --save
npm install sane --save
```

The application currently throws an exception due to string error (twilio-chat.js) but that isn't stopping it from working.

