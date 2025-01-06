// functions/submit.js
exports.handler = async (event, context) => {
  // 1. Only allow POST requests
  console.log("event.body:", event.body);
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: "Only POST requests are allowed." }),
    };
  }

  try {
    // 2. Parse the incoming JSON
    const body = JSON.parse(event.body);
    const Options = body.Options;  // e.g., "good", "meh", or "poor"

    // 3. Validate the choice
    if (!["Greate", "Average", "Poor"].includes(Options)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid poll choice." }),
      };
    }

    // 4. Process the choice (log, store in DB, etc.)
    console.log(`User selected: ${Options}`);

    // 5. Return a success message to Outlook
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: `Thank you for voting: ${Options}`,
      }),
    };
  } catch (error) {
    // Handle JSON parse errors or other exceptions
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }
};
