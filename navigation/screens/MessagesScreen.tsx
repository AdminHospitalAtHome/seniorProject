/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useEffect, useState } from 'react';
import {StyleSheet, View, Text,  FlatList, TouchableOpacity, RefreshControl, Button, Alert } from 'react-native';
import Config from "react-native-config";

const messages = [
  {id: '8',
  senderName: 'Physician1',
  receiverName: 'Yutong Chen',
  senderId: 'physician1@uhhg.org',
  receiverId: 'cheny33@rose-hulman.edu',
  content:  'This is a test again.',
  datetime: '2022-12-29T09:40:58.6219930Z', 
  },
  {id: '7',
  senderName: 'Yutong Chen',
  receiverName: 'Jimmy McKanna',
  senderId: 'cheny33@rose-hulman.edu',
  receiverId: 'jimmckanna@uhhg.org',
  content:  'Hi Jimmy! How are you again?',
  datetime: '2022-12-29T09:10:58.6219930Z',
  },
  {id: '6',
  senderName: "Jimmy McKanna",
  receiverName: "Yutong Chen",
  senderId: "jimmckanna@uhhg.org",
  receiverId: "cheny33@rose-hulman.edu",
  content: "test repeating.",
  datetime: "2022-12-29T09:00:48.6219930Z"
  },
  {id: '5',
  senderName: "Jimmy McKanna",
  receiverName: "Yutong Chen",
  senderId: "jimmckanna@uhhg.org",
  receiverId: "cheny33@rose-hulman.edu",
  content: "test repeating22222.",
  datetime: "2022-12-29T09:00:48.6219930Z"
  },
  {id: '4',
  senderName: "Jimmy McKanna",
  receiverName: "Yutong Chen",
  senderId: "jimmckanna@uhhg.org",
  receiverId: "cheny33@rose-hulman.edu",
  content: "test repeating33333.",
  datetime: "2022-12-29T09:00:48.6219930Z"
  },
  {id: '3',
  senderName: "Jimmy McKanna",
  receiverName: "Yutong Chen",
  senderId: "jimmckanna@uhhg.org",
  receiverId: "cheny33@rose-hulman.edu",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  datetime: "2022-12-29T09:00:44.6219930Z"
  },
  {id: '2',
  senderName: 'Yutong Chen',
  receiverName: 'Jimmy McKanna',
  senderId: 'cheny33@rose-hulman.edu',
  receiverId: 'jimmckanna@uhhg.org',
  content:  'Hi Jimmy! How are you?',
  datetime: '2022-12-22T14:15:32.6214440Z',
  },
  {id: '1',
  senderName: 'Physician1',
  receiverName: 'Yutong Chen',
  senderId: 'physician1@uhhg.org',
  receiverId: 'cheny33@rose-hulman.edu',
  content:  'This is a test.',
  datetime: '2022-12-21T07:10:44.6219930Z', 
 }
  
]

class MessageData {
  sender_name: string;
  receiver_name: string;
  sender: string;
  receiver: string;
  content: string;
  datetime:string;
  constructor(sender_name:string, receiver_name: string, sender:string, receiver: string, content: string,datetime:string ) {
    this.sender_name = sender_name;
    this.receiver_name = receiver_name;
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.datetime = datetime;
  }
}

export default function MessagesScreen({navigation,route}:{navigation:any,route:any}) {
  const { id, password } = route.params;
  const [data, setData] =   useState<MessageData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [inputText, setInputText] = useState('');
  let contactorName = '';
  let contactorId = '';
  useEffect(() => {
    fetchMessageData();
  }, []);

  const fetchMessageData =   async () => {
    const Buffer = require("buffer").Buffer;
    let encodedAuth = new Buffer(id + ":" + password).toString("base64");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${encodedAuth}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    console.log("*********************************************");
    console.log("CALLING GETMESSAGE AZURE FUNCTION");
    console.log("*********************************************");

    /* ------------------ */
    const url = `https://hospital-at-home-app.azurewebsites.net/api/GetUserMessages?code=wWie7dGZH-diWg4xGzosnX4mSG55C6nc7Dhlpw91GAtKAzFu0hioxg==`;
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .then(arr => {
        const fetched = [];
        console.log("at here")
        for (var obj of arr) {
          fetched.push(new MessageData(obj.sender_name, obj.receiver_name, obj.sender, obj.receiver, obj.content, obj.datetime));
        }
        setData(fetched.reverse());
      })
      .catch(error => console.log('error', error));
  }
  const onRefresh = () => {
    setRefreshing(true);
    fetchMessageData().then(() => setRefreshing(false));
  };

  let originMessages = data;
  let latestMessages: any[] = [];
  let groupedMessages = data.reduce((acc: any, curr) => {
    let key = `${curr.sender}-${curr.receiver}`;
    acc[key] = acc[key] || [];
    acc[key].push(curr);
    return acc;
  }, {});

  for (const key in groupedMessages) {
    let sortedMessages = groupedMessages[key].sort((a:any, b:any) => b.timestamp - a.timestamp);
    latestMessages.push(sortedMessages[0]);
  }

  // const uniqueSending: any[] = [...new Set(data.map((item) => item.sender))].map((sender) => {
  //   return data.find((item) => {return item.sender == sender});
  // });
  
  // const uniqueReceiving: any[] = [...new Set(data.map((item) => item.receiver))].map((receiver) => {
  //   return data.find((item) => item.receiver === receiver);
  // }); 

  
  function removeDuplicateUser(data: any[]) {
    for (let i=0; i<data.length-1; i++){
      for (let j=i+1; j< data.length; j++){
        if(data[i].sender== data[j].receiver){
          data.splice(j,1)
        }
        else if(data[i].receiver == data[j].sender){
          data.splice(j,1)
        }
      }
    }
    return data
  }
  function showPrompt()  {
    Alert.prompt(
      'Enter Your Name',
      'Please enter your name:',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (text: any) => {
            setInputText(text);
            console.log('OK Pressed, Name: ', text);
          },
        },
      ],
      'plain-text',
      '',
      'Your Name'
    );
  };

  return (
    <View style={styles.container}>
    <View style={styles.pageContainer}>
      <FlatList
//      data={originMessages}
       data={removeDuplicateUser(latestMessages)}
        keyExtractor={item => item.datetime}
        renderItem={({item}) => ( 
          <TouchableOpacity 
            style = {styles.card}
            onPress={() => {
              if(item.sender == id){contactorName = item.receiver_name; contactorId = item.receiver}else {contactorName = item.sender_name; contactorId = item.sender}
              navigation.navigate('Chat', {userName: contactorName, userId: contactorId,id:id, password: password, chatMessages: originMessages.filter((message) => {
              return  ( message.receiver == item.receiver && message.sender == item.sender)|| ( message.sender == item.receiver && message.receiver == item.sender)
            })})}} > 
            {/* {userName: ()=>{if item.sender}} */}
            <View style = {styles.userInfo}>
              {/* <View style={styles.userImageWrapper}>
                <Image style = {styles.userImg} source={item.userImg}></Image>
              </View> */}
              <View  style = {styles.textSection}>
                <View style = {styles.userInfoText}>
                  <Text style = {styles.userName}>
                    {(()=>{
                      //need to check if the user is the sender or the receiver
                      //return item.senderName
                      if(id==item.sender){
                        console.log("username is the same as the sender name")
                        return item.receiver_name
                      }else{
                        return item.sender_name
                      }
                    })()}
                  </Text>
                  <Text style = {styles.postTime}>
                  { (()=> {
                    const date1 = new Date();
                    const date2 = new Date(item.datetime);
                    if (Math.abs(date2.getTime() - date1.getTime()) < (12 * 60 * 60 * 1000)) {
                      return new Date(item.datetime).toLocaleTimeString()
                      //if the message was sent in 12 hours, return the time string
                    } else {
                      return new Date(item.datetime).toLocaleDateString()
                      //if the message was sent more than 12 hours, return the Date
                    }
                    })()}
                  </Text>
                  {/* item.datetime.substring(0, 10) + " "+item.datetime.substring(11, 16) */}
                </View>
                <Text numberOfLines ={1} style = {styles.messageText}>{item.content}</Text>
              </View>
            </View>
            {/* <Text>{item.senderName}</Text> */}
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
    <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.button}  onPress={ ()=> 
           {   Alert.alert(
            "My Title",
            "My Message",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          )}}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
    </View>
    {inputText !== '' && (
        <Text style={{ marginTop: 20 }}>
          Your Name: {inputText}
        </Text>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  pageContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '100%'
  },
  userInfo: {
    flexDirection: 'row' ,
    justifyContent: 'space-between'
  },
  userImageWrapper: {
    paddingTop: 15,
    justifyContent: 'space-between'
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 15
  },
  textSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottomr: 5
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular'
  },
  messageText: {
    fontSize: 12,
    color:  '#333333'
  },
  postTime: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Lato-Regular'
  },

  buttoncontainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 25,
  },
  text: {
    fontSize: 40,
  },
  button: {
    backgroundColor: '#0096FF',
    width: 65,
    height: 65,
    borderRadius: 30,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
    justifyContent: 'center',
  },
});