import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Config from 'react-native-config';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
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
import UserManager from '../../managers/UserManager';

const client = StreamChat.getInstance(`${Config.STREAM_CLIENT_API_KEY}`);

export default function StreamChatScreen() {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);
  const [thread, setThread] = useState<MessageType | null>();

  useEffect(() => {
    const setupClient = async () => {
      try {
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

  const onBackPress = () => {
    if (thread) {
      setThread(undefined);
    } else if (channel) {
      setChannel(undefined);
    }
  };

  if (!clientReady) return null;

  return (
    <OverlayProvider topInset={60}>
      <TouchableOpacity onPress={onBackPress} disabled={!channel}>
        <View style={{ height: 60, paddingLeft: 16, paddingTop: 40 }}>{channel && <Text>Back</Text>}</View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Chat client={client}>
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
            <ChannelList onSelect={setChannel} />
          )}
        </Chat>
      </View>
    </OverlayProvider>
  );
};