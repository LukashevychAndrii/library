function getErrorDetails(error: string) {
  let alertTitle = "An Error occured!";
  let alertText = "Something went wrong!";
  let alertType = "error";

  if (error === "auth/user-not-found") {
    alertTitle = "Could not find the user!";
    alertText = "Two or more fields are incorrect!";
    alertType = "error-auth-hard";
  }

  if (error === "auth/missing-password") {
    alertTitle = "Missing password!";
    alertText = "Make sure you have entered password!";
    alertType = "error-auth";
  }
  if (error === "auth/wrong-password") {
    alertTitle = "Wrong password!";
    alertText = "Make sure you have entered correct password!";
    alertType = "error-auth";
  }

  if (error === "auth/invalid-email") {
    alertTitle = "Invalid email!";
    alertText = "Make sure you have entered correct email!";
    alertType = "error-auth";
  }
  if (error === "auth/email-already-in-use") {
    alertTitle = "Email is already in use!";
    alertText = "Account with this email is already is use!";
    alertType = "error-auth";
  }
  if (error === "auth/too-many-requests") {
    alertTitle = "Too many requests!";
    alertText = "Try again later!";
    alertType = "error-auth-hard";
  }
  return { alertTitle: alertTitle, alertText: alertText, alertType: alertType };
}
export default getErrorDetails;
