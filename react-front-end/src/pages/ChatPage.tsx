import { use, useEffect, useRef, useState } from "react";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { MonoStyleText } from "../components/Text";
import { BlackButton, BorderlessButton, WhiteButton } from "../components/Button";
import { useNavigate, useSearchParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import { isStringEmpty } from "../functions/Utils";
import { ChatMessage } from "../type/ObjectType";
import { getChatMessagesForConversation } from "../functions/ChatFunction";


function ChatPage () {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toUserId = searchParams.get("touserid") as string;
    const toUserName = searchParams.get("tousername") as string;
    const [message, setMessage] = useState("");
    const [chatMessageList, setChatMessageList] = useState<ChatMessage[]>([])
    const [conn, _] = useState<signalR.HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5175/chathub")
        .withAutomaticReconnect()
        .build());
    const chatDivId = crypto.randomUUID();
    const chatNum = 20;

    conn.on("ReceiveMessage", (messageId, user, message) => {
        if (user === localStorage.getItem("userid")) {
            conn.invoke("MarkMessageAsRead", messageId);
        }
        if (chatMessageList.length > chatNum) {
            setChatMessageList([...chatMessageList.slice(
                chatMessageList.length - chatNum + 1, chatMessageList.length), 
                {toUserId: user, content: message} as ChatMessage
            ]);
        } else {
            setChatMessageList([...chatMessageList, {toUserId: user, content: message} as ChatMessage]);
        }
        document.getElementById(chatDivId)?.scrollTo(0, document.getElementById(chatDivId)?.scrollHeight as number);
    });

    const initiateChat = async () => {
        setChatMessageList(await getChatMessagesForConversation({userid: localStorage.getItem("userid") as string, retrieveNum: chatNum}));
        if (conn.state == signalR.HubConnectionState.Disconnected) {
            await conn.start();
        }
        await conn.invoke("MarkMessageOfGivenSenderAsRead", localStorage.getItem("userid") as string, toUserId);
    }
    
    const endChatConnection = async () => {
        if (conn.state == signalR.HubConnectionState.Connected) {
            await conn.stop();
        }
    }

    useEffect(() => {
        initiateChat();
    }, []);

    const sendMessageHandler = async (message : string) => {
        if (conn.state != signalR.HubConnectionState.Connected) {
            await conn.start();
        }
        if (isStringEmpty(message)) {
            return;
        }
        await conn.invoke("SendMessage", toUserId, message);
        setMessage("");
    }
  
    return <ResponsiveDiv style="flex flex-col mt-20 mx-50" children={<>
        <MonoStyleText style="text-2xl bg-black p-2 text-center text-white" content={"Chat with: " + toUserName} />
        <ResponsiveDiv style="flex flex-col border-1 w-full mb-5" children={<>
            <ResponsiveDiv style="flex flex-row justify-center" children={<>
                <BorderlessButton buttonName="load previous messages" style="transition hover:scale-110 hover:underline hover:text-blue-500" clickHandler={() => {}} />
            </>} />
            <ResponsiveDiv id={chatDivId} style="flex flex-col justify-end w-full h-200 gap-5 overflow-auto" children={<>
                {chatMessageList.map((msg, index) => {
                    if (chatMessageList[index].toUserId === localStorage.getItem("userid")) {
                        return <ResponsiveDiv key={index} style="flex flex-row justify-start m-3" children={<>
                            <MonoStyleText style="text-xl border-1 px-2 py-1" content={msg.content} />
                        </>} />
                    } else {
                        return <ResponsiveDiv key={index} style="flex flex-row justify-end m-3" children={<>
                            <MonoStyleText style="text-xl bg-green-300 px-2 py-1" content={msg.content} />
                        </>} />
                    }
                })}
            </>} />
        </>} />
        <ResponsiveDiv style="flex flex-row gap-5 mb-20" children={<>
            <input id={crypto.randomUUID()} name="message" value={message} className="w-2/3 h-10 border-1 focus:outline-none" onChange={
                (e) => setMessage(e.target.value)
            }/>
            <WhiteButton buttonName="SEND" size="w-60 h-10" clickHandler={() => {
                sendMessageHandler(message);
            }} />
            <BlackButton buttonName="LEAVE" size="w-60 h-10" clickHandler={() => {
                endChatConnection();
                navigate("/orders");
            }} />
        </>} />
    </>} />
}

export default ChatPage;