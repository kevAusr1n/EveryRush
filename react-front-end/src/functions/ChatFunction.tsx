import APICall from "../config/ApiConfig";
import { ChatMessage } from "../type/ObjectType";
import { GetUnreadMessagesStatisticsResponse } from "../type/ResponseType";

async function getChatMessagesForConversation(props: {userid: string, retrieveNum: number}) : Promise<ChatMessage[]> {
    var messages: ChatMessage[] = [];
    // TODO: get chat messages from server
    await APICall().get(`api/chat/messages?userid=${props.userid}&retrieveNum=${props.retrieveNum}`)
        .then((res) => {
            messages = res.data.chatMessages;
        })
    return messages;
}

async function getUnreadMessageStatistics(props: {userid: string, page: number, size: number}) : Promise<GetUnreadMessagesStatisticsResponse> {
    var unreadMessageStatistic: GetUnreadMessagesStatisticsResponse = {} as GetUnreadMessagesStatisticsResponse;
    // TODO: get chat messages from server
    await APICall().get(`api/chat/messages/unread/${props.userid}?page=${props.page}&size=${props.size}`)
        .then((res) => {
            unreadMessageStatistic = res.data;
        })
    return unreadMessageStatistic;
}

export { getChatMessagesForConversation, getUnreadMessageStatistics };