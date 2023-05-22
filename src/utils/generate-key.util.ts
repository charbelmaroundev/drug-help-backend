const generator = require('generate-password');

export const generateKey = () => {
  const key = generator.generate({
    length: 6,
    numbers: true,
  });

  return key;
};
