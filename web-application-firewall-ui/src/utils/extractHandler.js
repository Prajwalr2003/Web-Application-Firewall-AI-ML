const extractErrorMessage = (data) => {
  if (typeof data === "string" && data.includes("<pre>Error:")) {
    const match = data.match(/<pre>Error:\s*(.*?)<br>/);
    if (match) {
      return match[1];
    }
  }
  return "An unexpected error occurred";
};

export default extractErrorMessage;
