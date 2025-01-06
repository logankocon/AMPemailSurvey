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
    const Option = body.Option;  // e.g., "good", "meh", or "poor"

    // 3. Validate the choice
    if (!["Greate", "Average", "Poor"].includes(Option)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid poll choice." }),
      };
    }

    // 4. Process the choice (log, store in DB, etc.)
    console.log(`User selected: ${Option}`);

    // 1. Build the POST body with form data so Netlify recognizes it as a form submission.
      //    We'll use URLSearchParams to mimic a standard HTML form submission.
      const formName = 'survey'; // Must match the <form name="survey"> in your HTML
      const postData = new URLSearchParams();
      postData.append('form-name', formName);
  
      // Append the fields you want to store
      // For example, if your AMP form includes <input name="feedback" />, pass that through:
      if (body.Option) postData.append('feedback', body.Option);
      // If you have other fields:
      //if (data.email) postData.append('email', data.email);
      // etc.
  
      // 2. Post to the root of your Netlify site (or a specific page) so Netlify logs it
      //    as if it were a normal form submission.
      //
      //    IMPORTANT: Replace <YOUR-SITE> with your actual Netlify subdomain
      //    (e.g., my-amp-site.netlify.app) or a custom domain you’ve set up on Netlify.
      const netlifyResponse = await fetch('https://sunny-manatee-d3499a.netlify.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData.toString(),
      });
  
      // 3. Check if Netlify accepted the submission
      //    (Note: Even on success, Netlify may return a 301/302 redirect or an HTML page)
      if (!netlifyResponse.ok) {
        console.log("testFAIL");
        throw new Error(`Netlify form submission failed: ${netlifyResponse.status}`);
      }

    // 5. Return a success message to Outlook
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: `Thank you for voting: ${Option}`,
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
