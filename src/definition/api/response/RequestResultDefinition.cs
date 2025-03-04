public class ApiResponseDefinition 
{
    public class Result 
    {
        public static readonly string SUCCESS = "success";
        public static readonly string FAILURE = "failure";
    }

    public class Failure 
    {
        public static class UserRelatedFailure 
        {
            public static readonly string EMAIL_EXIST = "email already exist";
            public static readonly string USER_NOT_EXIST = "user not exist";
            public static readonly string SIGN_INFO_INCORRECT = "email and/or password incorrect";
            public static readonly string CONFIRM_EMAIL_FAIL = "confirm email fail";
            public static readonly string PASSWORD_RESET_FAIL = "reset password fail";
            public static readonly string CHANGE_PASSWORD_FAIL = "change password fail";
            public static readonly string CHANGE_USERNAME_FAIL = "change username fail";
            public static readonly string INVALID_AUTH_PROVIDER = "invalide auth provider";
            public static readonly string INVALID_AUTH_TOKEN = "invalide auth token";
            public static readonly string THIRD_PARTY_USER_FIRSTTIME_SIGNIN = "thrird party user first time signin";
            public static readonly string SIGNUP_FAIL = "signup fail";
            public static readonly string EMAIL_NOT_CONFIRMED = "email not confirmed fail";
            public static readonly string INVALID_USER_INFO_FOR_UPDATE = "given user info is invalid for update";
        }

        public static class ProductRelatedFailure 
        {   
            public static readonly string NO_IMAGE_PROVIDED = "product must have image as a part of detail";
            public static readonly string PRODUCT_NOT_EXIST = "some or products not exist";
            public static readonly string PRODUCT_OUT_OF_STOCK = "some or products out of stock";
        }

        public static class ReviewRelatedFailure 
        {
            public static readonly string ONLY_ONE_REVIEW_ALLOWED = "you have already reviewed this product for this oder";
        }
    }
}