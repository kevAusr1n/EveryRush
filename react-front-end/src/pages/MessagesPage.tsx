import { useEffect, useState } from "react";
import { WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import Pagination from "../components/Pagination";
import { GetUnreadMessagesStatisticsResponse } from "../type/ResponseType";
import { isUserSignedIn } from "../functions/UserFunction";
import SignInRequiredPage from "./SignInRequiredPage";
import { MonoStyleText } from "../components/Text";
import { getUnreadMessageStatistics } from "../functions/ChatFunction";
import { useNavigate } from "react-router";

function MessagesPage() {
    const navigate = useNavigate();
    const [size, setSize]  = useState(5);
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<GetUnreadMessagesStatisticsResponse>({unreadSenders:[], totalCount: 0, totalPages: 0});

    const getUnderMessageStatisticsHandler = async () => {
        setResponse(await getUnreadMessageStatistics({
            userid: localStorage.getItem("userid") as string,
            page: page, 
            size: size, 
        }));
    };

    useEffect(() => {
        getUnderMessageStatisticsHandler();
    }, [page, size])

    return (
        (!isUserSignedIn() && <SignInRequiredPage message="please sign in to manage messages"/>) ||
        <ResponsiveDiv style="flex flex-col mt-20" children={<>
            {response.unreadSenders.length == 0 && <ResponsiveDiv style="flex flex-col items-center gap-5" children={<>
                <MonoStyleText key={crypto.randomUUID()} style="text-xl" content="You have no message" />
            </>} />}
            {response.unreadSenders.length != 0 && <ResponsiveDiv style="flex flex-col mx-20 mb-20 gap-5 justify-center" children={<>
                {response.unreadSenders.map((unreadSender, index) => {
                    return <ResponsiveDiv key={index} style="w-full flex flex-row justify-between items-center shadow-xl p-5" children={<>
                        <MonoStyleText style="w-1/3 text-xl" content={unreadSender.senderName} />
                        <ResponsiveDiv style="w-1/3 flex flex-row items-center gap-5" children={<>
                            <MonoStyleText key={crypto.randomUUID()} style="text-white bg-red-500 px-2 rounded-full text-xl" content={unreadSender.unreadCount.toString()} />
                            <MonoStyleText key={crypto.randomUUID()} style="text-xl" content={"unread message" + (unreadSender.unreadCount > 1 ? "s" : "")} />
                        </>} />
                        <WhiteButton buttonName="CHAT" size="h-10" clickHandler={
                            () => navigate(`/chat?touserid=${unreadSender.senderId}&tousername=${unreadSender.senderName}`)
                        } />
                    </>} />
                })}
            </>} />}     
            {response.unreadSenders.length != 0 && <Pagination 
                    size={size}
                    setSize={setSize}
                    page={page}
                    setPage={setPage}
                    totalPages={response.totalPages}
                    totalCount={response.totalCount} 
                />}
        </>} />
    )
}

export default MessagesPage;