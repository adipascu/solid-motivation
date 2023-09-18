/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import inquirer from "inquirer";
import { OAuth2Client } from "google-auth-library";

(async () => {
  console.log(
    "Follow the instructions from https://developer.chrome.com/docs/webstore/using_webstore_api/",
  );
  const { clientID, clientSecret } = await inquirer.prompt([
    {
      type: "input",
      name: "clientID",
      message: "Enter your client ID",
    },
    {
      type: "input",
      name: "clientSecret",
      message: "Enter your client secret",
    },
  ]);

  const oauth2Client = new OAuth2Client(
    clientID,
    clientSecret,
    "urn:ietf:wg:oauth:2.0:oob",
  );
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/chromewebstore", // you can add multiple scopes here
  });
  const { code } = await inquirer.prompt([
    {
      type: "input",
      name: "code",
      message: `Authorize this app by visiting this url: ${authUrl}\nEnter the code from that page here: `,
    },
  ]);

  const { tokens } = await oauth2Client.getToken(code);
  console.log("Successfully retrieved refresh token:", tokens.refresh_token);
})();
