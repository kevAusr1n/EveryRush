public class FileService
{
    private readonly AppDbContext _appDbContext;

    public FileService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<IList<string>> SaveFilesWithDb(IList<IFormFile> toSaveFiles, string relationId) {
        IList<string> toSaveFilePaths = await SaveFiles(toSaveFiles);
        for (int i = 0; i < toSaveFilePaths.Count; i++)
        {
            _appDbContext.AppFiles.Add
            (
                new AppFile {
                    Id = Guid.NewGuid().ToString(),
                    Url = toSaveFilePaths[i],
                    ProductId = relationId,
                    Format = toSaveFiles[i].ContentType
                }
            );
        }
        return toSaveFilePaths;
    }

    public async Task<IList<string>> SaveFiles(IList<IFormFile> toSaveFiles) {
        IList<string> toSaveFilePaths = new List<string>();
        foreach (IFormFile file in toSaveFiles) 
        {
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var relativeStorePath = Path.Combine(
                    StaticFileRootPathDefinition.GetImagePath(), 
                    Guid.NewGuid().ToString() + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + "-image." + file.ContentType.Split("/")[1]
                );
                var storePath = Path.Combine(StaticFileRootPathDefinition.GetStaticFileRootPath(), relativeStorePath);
                toSaveFilePaths.Add(relativeStorePath);
                await file.CopyToAsync(new FileStream(storePath, FileMode.OpenOrCreate));
            }
        } 
        return toSaveFilePaths;
    }

    public async Task DeleteFiles(IList<string> toDeleteFilePaths) {
        foreach (string filePath in toDeleteFilePaths) {
            var storePath = Path.Combine(StaticFileRootPathDefinition.GetStaticFileRootPath(), filePath);
            if (File.Exists(storePath)) {
                File.Delete(storePath);
            }
        }
    }
}