public class ThirdPartySignInProviderConfig {
    public static readonly string GOOGLE = "google";

    public static Boolean FromThirdParty(string provider) {
        if (String.IsNullOrEmpty(provider)) {
            return false;
        }
        return GOOGLE.Equals(provider);
    }
}