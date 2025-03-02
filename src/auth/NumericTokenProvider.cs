using EveryRush.Entity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

public class NumericTokenProvider<TUser> : DataProtectorTokenProvider<TUser> where TUser : class
{
    private readonly AppDbContext _appDbContext;

    public NumericTokenProvider(
        IDataProtectionProvider dataProtectionProvider,
        IOptions<NumericTokenProviderOptions> options,
        ILogger<DataProtectorTokenProvider<TUser>> logger,
        AppDbContext appDbContext)
        : base(dataProtectionProvider, options, logger)
    {
        _appDbContext = appDbContext;
    }

    public override async Task<string> GenerateAsync(string purpose, UserManager<TUser> manager, TUser user)
    {
        Random random = new Random();
        string token = random.Next(10000000, 99999999).ToString(); 
        var userId = await manager.GetUserIdAsync(user);

        var verificationCode = new VerificationCode {
            Id = Guid.NewGuid().ToString(),
            AppUserId = userId,
            Token = token,
            CreatedAt = DateTime.Now
        };

        _appDbContext.VerificationCodes.Add(verificationCode);
        await _appDbContext.SaveChangesAsync();

        return token;
    }

    public override async Task<bool> ValidateAsync(string purpose, string token, UserManager<TUser> manager, TUser user)
    {
        var userId = await manager.GetUserIdAsync(user);
        var verificationCode = _appDbContext.VerificationCodes.Where(v => v.AppUserId == userId && v.Token == token).FirstOrDefault();
        if (verificationCode == null) 
        {
            return false;
        }
 
        if (DateTime.Now.Subtract(verificationCode.CreatedAt) > Options.TokenLifespan)
        {
            _appDbContext.VerificationCodes.Remove(verificationCode);
            await _appDbContext.SaveChangesAsync();
            return false;
        }

        _appDbContext.VerificationCodes.Remove(verificationCode);
        await _appDbContext.SaveChangesAsync();

        return true;
    }
}

public class NumericTokenProviderOptions : DataProtectionTokenProviderOptions
{
    public NumericTokenProviderOptions()
    {
        Name = "NumericTokenProvider";
        TokenLifespan = TimeSpan.FromSeconds(300);
    }
}
