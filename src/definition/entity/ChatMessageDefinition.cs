public class ChatMessageDefinition
{
    public class Status 
    {
        public readonly static int UNREAD = 0;
        public readonly static int READ = 1;
    }

    public class Rate
    {
        public readonly static int VERY_BAD = 1;
        public readonly static int BAD = 2;
        public readonly static int ACCEPTABLE = 3;
        public readonly static int GOOD = 4;
        public readonly static int VERY_GOOD = 5;
    }
}