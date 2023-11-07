function generateRandomNumber(length) {
  const numbers = "0123456789ABCDEFGHIJ";
  let result = "";
  const numLength = numbers.length;
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numLength));
  }
  return result;
}

export const codeToSend = generateRandomNumber(6);
