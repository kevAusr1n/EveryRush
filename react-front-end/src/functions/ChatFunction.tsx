import APICall from "../config/ApiConfig";
import { ChatMessage } from "../type/EntityType";

async function getChatMessages(props: {userid: string, retrieveNum: number}) : Promise<ChatMessage[]> {
    var messages: ChatMessage[] = [];
    // TODO: get chat messages from server
    await APICall().get(`api/chat/messages?userid=${props.userid}&retrieveNum=${props.retrieveNum}`)
        .then((res) => {
            messages = res.data.chatMessages;
        })
    return messages;
}

export { getChatMessages };