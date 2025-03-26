class SendTestEmail < ApplicationMailer
  def sample_email
    mail(
      to: 'oliverstewart35@gmail.com', # Replace with your email address
      subject: 'Test Email from Evolution App'
    ) do |format|
      format.text { render plain: 'This is a test email sent from your Evolution app using SendGrid via SMTP!' }
    end
  end
end
