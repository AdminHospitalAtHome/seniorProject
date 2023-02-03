/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text,  FlatList, TouchableOpacity, Image} from 'react-native';

const messages = [
  {id: '1',
  senderName: "Aidan Mazany",
  receiverName: "Jimmy Mckanna",
  senderId: "mazanyam@rose-hulman.edu",
  receiverId: "jimmckanna@uhhg.org",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  datetime: "2022-12-29T09:00:44.6219930Z"
  },
  {id: '2',
  senderName: 'Yutong Chen',
  receiverName: 'Aidan Mazan',
  senderId: '',
  receiverId: '',
  content:  'Hi Aidan! How are you?',
  datetime: '2022-12-22T14:15:32.6214440Z',
  },
  {id: '3',
  senderName: 'Jimmy McKanna',
  receiverName: 'Aidan Mazany',
  senderId: '',
  receiverId: '',
  content:  'Hi Aidan! This is a test.',
  datetime: '2022-12-21T07:10:44.6219930Z', 
 }
  
]

class MessageData {
  senderName: string;
  receiverName: string;
  senderId: string;
  receiverId: string;
  content: string;
  datetime:string;
  constructor(senderName:string, receiverName: string, senderId:string, receiverId: string, content: string,datetime:string ) {
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.datetime = datetime;
  }
}

export default function MessagesScreen({navigation}:{navigation:any}) {
  return (
    <View style={styles.pageContainer}>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity 
            style = {styles.card}
            onPress={() => navigation.navigate('Chat', {userName: item.senderName})} > 
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
                      return item.senderName
                    })()}
                  </Text>
                  <Text style = {styles.postTime}>
                  { (()=> {
                    const date1 = new Date("2022-12-29T09:55:44.6219930Z");
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  }

});