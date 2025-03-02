import { Star } from "lucide-react";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import { MonoStyleText } from "../components/Text";
import { RedButton, WhiteButton } from "../components/Button";
import { Product, Review } from "../type/EntityType";
import { useState } from "react";
import InputField from "../components/InputField";

function ReviewBoxPage(props: {
    review: Review, 
    product: Product
}) {
    const [replyDropdown, setReplyDropdown] = useState(false);

    return (
        <ResponsiveDiv style="flex flex-col w-full items-start justify-between p-5 my-5 border-1" children={<>
            <ResponsiveDiv style="flex flex-row w-full gap-5" children={<>
                <MonoStyleText style="w-1/5 text-xl font-bold" content={props.review.reviewerName} />
                <ResponsiveDiv style="flex flex-row w-full gap-2" children={<>
                    {Array.from({ length: props.review.rating }, (_, i) => i + 1).map((index) => {
                        return <Star key={index} fill="yellow" />
                    })}
                </>} />
                <MonoStyleText style="w-1/3 text-xl" content={props.review.createdAt.toLocaleUpperCase()} />
            </>} />
            <MonoStyleText style="py-5" content={props.review.content} />
            {localStorage.getItem("userid") == props.product.userId && <WhiteButton buttonName="REPLY" size="h-10" clickHandler={() => {
                setReplyDropdown(true);
            }} />}
            <MonoStyleText style="w-full text-center underline transition hover:scale-110 hover:text-blue-500" content="expand reply" />
            {replyDropdown && <ResponsiveDiv style="flex flex-col gap-5 mt-5" children={<>
                <InputField inputName="Comment" inputType="textarea" inputValue="" style="w-200 h-50" />
                <ResponsiveDiv style="w-full flex flex-row gap-5" children={<>
                    <WhiteButton buttonName="SUBMIT" size="w-60 h-10" clickHandler={() => {}} />
                    <RedButton buttonName="CANCEL" size="w-60 h-10" clickHandler={() => {
                        setReplyDropdown(false);
                    }} />
                </>} />      
            </>} />}
        </>} />
    )
}

export default ReviewBoxPage;