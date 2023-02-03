import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
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

export default function ChatScreen({navigation}:{navigation:any}) {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        setMessages([
          {
            _id: 1,
            text: 'Hi Aidan!',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
             
            },
          },
        ])
      }, [])
    
      const onSend = useCallback((messages:any = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }, [])
    
      return (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
    )
 
    
    // return (
    //   <View style={styles.pageContainer}>
    //     <Text
    //       onPress={() => navigation.navigate('Home')}
    //       style={{fontSize: 10}}>
    //       Click to Go Home
    //     </Text>
    //   </View>
    // );
  }
  
  const styles = StyleSheet.create({
    pageContainer: {
      backgroundColor: '#FFFFFF',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
