export const aboutPage = (req, res) => {
    res.render('about', { title: 'About Us', user: req.user });
  };