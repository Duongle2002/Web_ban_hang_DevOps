import MessageService from '../services/MessageService.mjs';

export const contactPage = (req, res) => {
  res.render('contact', { title: 'Contact Page', user: req.user });
};

export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await MessageService.submitMessage({ name, email, subject, message });
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: 'Error sending message. Please try again.', error: error.message });
  }
};