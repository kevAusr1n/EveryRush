import APICall from "../config/ApiConfig"
import ReviewType from "../config/ReviewTypeConfig";
import { GetReviewsResponse } from "../type/ResponseType";

async function writeReview(props: {
    orderId: string,
    productId: string,
    rating: number,
    content: string
}) {
    var request = {
        userid: localStorage.getItem("userid") as string,
        orderId: props.orderId,
        productId: props.productId,
        rating: props.rating,
        content: props.content,
        type: ReviewType.REVIEW
    }
    await APICall().post('/api/reviews', request);
}

async function getPaginatedReviews(props: {
    productId: string,
    page: number,
    size: number
}) : Promise<GetReviewsResponse> {
    var getPaginatedReviewsResponse: GetReviewsResponse = {} as GetReviewsResponse;
    await APICall()
        .get(`/api/reviews?productId=${props.productId}&page=${props.page}&size=${props.size}`)
        .then((res) => {
            getPaginatedReviewsResponse = res.data;
        })
    
    return getPaginatedReviewsResponse
}

export { writeReview, getPaginatedReviews };
