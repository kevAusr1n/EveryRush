public class StaticFileRootPathDefinition
{
    public static string GetStaticFileRootPath()
    {
        var staticFileRootPath = Environment.GetEnvironmentVariable("STATIC_FILE_ROOT_PATH");
        if (string.IsNullOrEmpty(staticFileRootPath))
        {
            staticFileRootPath = "wwwroot";
        }
        return staticFileRootPath;
    }

    public static string GetImagePath() {
        return "images";
    }
}