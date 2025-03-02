using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System.Net.Mail;

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
        string fromMail = "kevinausrain@gmail.com";
        string fromPassowrd = "yher keja glmv rjsx";

        MailMessage mailMessage = new MailMessage();
        mailMessage.From = new MailAddress(fromMail);
        mailMessage.To.Add(toEmail);
        mailMessage.Subject = subject;
        mailMessage.Body = message;

        using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587))
        {
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new System.Net.NetworkCredential(fromMail, fromPassowrd);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}