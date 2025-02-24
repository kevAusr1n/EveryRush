public class FileFormatMagicBytes {
    public static readonly Dictionary<byte[], string> _fileSignatures = new Dictionary<byte[], string>
    {
        { new byte[] { 0xFF, 0xD8, 0xFF, 0xE1 }, "image/jpeg" },  // JPEG
        { new byte[] { 0x89, 0x50, 0x4E, 0x47 }, "image/png" },  // PNG
    };
}