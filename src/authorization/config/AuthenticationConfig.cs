using System.Text;

public class AuthenticationConfig {
    public class Scheme
    {
        public static readonly string Default = "Cookie";

        public static readonly string Cookie = "Cookie";

        public static readonly string JWT = "JWT";
    }

    public class JWT
    {
        public static readonly byte[] Key = Encoding.UTF8.GetBytes("ThisIsASecretKeyForJWTWhichIsUsedForTestPurpose");
    }
}
