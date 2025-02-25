using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using PostmarkDotNet;
using PostmarkDotNet.Model;
using SendGrid;
using SendGrid.Helpers.Mail;

public class EmailSender : IEmailSender
{
    public EmailSender(IOptions<AuthMessageSenderConfig> configAccessor)
    {
        Config = configAccessor.Value;
    }

    public AuthMessageSenderConfig Config { get; }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        Console.WriteLine("Sending email to " + toEmail + "\n subject: " + subject + "\n message: " + message);
        Console.WriteLine("Postmark token: " + Config.PostmarkToken);
        var email = new PostmarkMessage() {
            To = toEmail,
            From = "22007669@student.curtin.edu.au",
            TrackOpens = true,
            Subject = subject,
            TextBody = message,
            HtmlBody = message,
            Tag = "Password Reset"
        };

        var client = new PostmarkClient(Config.PostmarkToken);
        await client.SendMessageAsync(email);
    }
}