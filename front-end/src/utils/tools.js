export const capitalizeFirstChar = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const fileToBase64 = (value) => {
  if (value && value[0]) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(value[0]);
    });
  }
  return Promise.resolve();
}