/*
This file contains the code for the messages screen, which uses Stream Chat React Native components to handle chat functionality between users (e.g., patients and healthcare providers).
It implements a chat feature that allows users to communicate with each other in real-time, leveraging the 'stream-chat-react-native' library.
*/

// Import required libraries and components
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Config from 'react-native-config';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
// Import the StreamChat library for handling real-time chat functionality
// Import components from the 'stream-chat-react-native' library
// These components provide the necessary UI and functionality for a chat application
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageType,
  OverlayProvider,
  Thread,
} from 'stream-chat-react-native';
// Import UserManager for handling user-related data and functions
import UserManager from '../../managers/UserManager';

// Create a new StreamChat client instance with the provided API key from the configuration
const client = StreamChat.getInstance(`${Config.STREAM_CLIENT_API_KEY}`);

// Define the StreamChatScreen component
// It handles channel selection, message display, and thread management for the chat application
export default function StreamChatScreen() {
  const [channel, setChannel] = useState<ChannelType>(); // currently selected channel
  const [clientReady, setClientReady] = useState(false); // indicates if the StreamChat client is ready to use
  const [thread, setThread] = useState<MessageType | null>(); // currently selected thread

  // useEffect hook to set up the StreamChat client
  useEffect(() => {
    const setupClient = async () => {
      try {
        // Connect the user with their details and token, and set clientReady to true
        await client.connectUser(
          {
            id: UserManager.getInstance().getId().replace(/[^a-zA-Z]+/g, ''),
            name: `${UserManager.getInstance().getFirstName()} ${UserManager.getInstance().getLastName()}`,
          },
          UserManager.getInstance().getStreamToken()
        );
        setClientReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    setupClient();
  }, []);

  // onBackPress function handles back button press
  const onBackPress = () => {
    // If a thread is open, close it by setting the thread state to undefined
    if (thread) {
      setThread(undefined);
    } // If a channel is open (and no thread is open), close it by setting the channel state to undefined
    else if (channel) {
      setChannel(undefined);
    }
  };

  if (!clientReady) return null; // If the client is not ready, return null to not render anything

  return (
    // Render the OverlayProvider, TouchableOpacity for back button, and Chat components
    // OverlayProvider: provides overlays for the chat UI components
    // TouchableOpacity: handles back button press
    // Chat: main chat component, contains ChannelList and Channel components
    <OverlayProvider topInset={60}>
      <TouchableOpacity onPress={onBackPress} disabled={!channel}>
        <View style={{ height: 60, paddingLeft: 16, paddingTop: 40 }}>
          {channel && <Text style={{color:'black'}}>Back</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        {/*
          Conditionally render ChannelList or Channel and Thread components based on the channel and thread state
        */}
        <Chat client={client}>
          {/*
            If a channel is selected, render Channel and its children components (MessageList, MessageInput, and Thread)
          */}
          {channel ? (
            <Channel channel={channel} keyboardVerticalOffset={60} thread={thread} threadList={!!thread}>
              {thread ? (
                <Thread />
              ) : (
                <>
                  <MessageList onThreadSelect={setThread} />
                  <MessageInput />
                </>
              )}
            </Channel>
          ) : (
            // If no channel is selected, render ChannelList to display a list of available channels
            <ChannelList onSelect={setChannel} />
          )}
        </Chat>
      </View>
    </OverlayProvider>
  );
};