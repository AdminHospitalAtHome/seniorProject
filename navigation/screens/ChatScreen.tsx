import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import Config from 'react-native-config';
// need to do "npm install react-native-gifted-chat --save"

class ChatData {
    senderId: string;
    receiverId: string;
    content: string;
    datetime:string;
    constructor(senderId:string, receiverId: string, content: string,datetime:string ) {
      this.senderId = senderId;
      this.receiverId = receiverId;
      this.content = content;
      this.datetime = datetime;
    }
  }

export default function ChatScreen(this: any, {route}:{route:any}) {
  const {userName, userId, id, password, chatMessages}  = route.params
  const [messages, setMessages] = useState<any[]>([]);
  let receivedMessages = chatMessages.filter(((message: any) => {
    return message.sender_name == userName
  }))
  console.log("all messages: " )
  console.log(chatMessages)
  console.log("received messages:")
  console.log(receivedMessages) 
  useEffect(() => {
    setMessages(chatMessages.map((message: { sender_name:string, receiver_name: string, sender:string, receiver: string, content: string,datetime:string}) => ({
      _id: message.datetime,
      text: message.content,
      createdAt: new Date(message.datetime),
      user: {
        _id: message.sender,
        name: message.sender_name
      },
    })))
  }, [])
  
  function SubmitUpdates (message: any) {
    async function fetchMessageData() {
      console.log("*********************************************");
      console.log("CALLING UploadMessage AZURE FUNCTION");
      console.log("*********************************************");

      const Buffer = require("buffer").Buffer;
      let encodedAuth = new Buffer(id + ":" + password).toString("base64");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${encodedAuth}`);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(message)
      }; 

      var url = `https://hospital-at-home-app.azurewebsites.net/api/UploadMessage?code=q-xY09fg-fiUiiHB124cI_YmSQukuhW1IdYMLS_4IzuZAzFuMPjPMA==` 
      url += `&receiver=${userId}`;
      console.log(url);
      const created:boolean = await fetch(url, requestOptions)
        .then(response => (response.status == 200 ? true : false))
        .catch(error => false);
      return created;
    }
    fetchMessageData()
  }
  
  const onSend = useCallback((messages:any = []) => {
    SubmitUpdates(messages[0].text)
    console.log(messages[0].text);
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: id,
        }}
        renderInputToolbar={(props:any) => (
          <InputToolbar {...props} textInputProps={{ style: { color: 'black' , width: 320} }} />
        )}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
