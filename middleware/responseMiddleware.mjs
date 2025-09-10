const addBaseUrl = (req, res, next) => {
    const baseUrl = process.env.BASE_URL || 'https://nodejs-ck-x8q8.onrender.com';
    const originalJson = res.json;
    res.json = function (data) {
      const modifiedData = JSON.parse(JSON.stringify(data));
      const addBaseUrlToImages = (obj) => {
        if (Array.isArray(obj)) {
          obj.forEach(addBaseUrlToImages);
        } else if (obj && typeof obj === 'object') {
          for (const key in obj) {
            if (key === 'image' && obj[key] && !obj[key].startsWith('http')) {
              obj[key] = `${baseUrl}${obj[key]}`;
            } else {
              addBaseUrlToImages(obj[key]);
            }
          }
        }
      };
      addBaseUrlToImages(modifiedData);
      return originalJson.call(this, modifiedData);
    };
    next();
  };
  
  export default addBaseUrl;
