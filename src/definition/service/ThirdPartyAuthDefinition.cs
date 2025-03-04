public class ThirdPartyAuthDefinition {
    
    public class Provider {
        public static readonly string GOOGLE = "google";
    }
   
    public static Boolean FromGoogle(string provider) {
        return Provider.GOOGLE.Equals(provider);
    }
}