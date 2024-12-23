// functions/submit-survey.js
// If you're on Node 16, you may need: const fetch = require('node-fetch');
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  
    try {
      // Parse the JSON body from your AMP form submission
      // (AMP can send either JSON or x-www-form-urlencoded, depending on your form setup)
      const params = new URLSearchParams(event.body);
      const data = Object.fromEntries(params);
      console.log(data);
      //const data = JSON.parse(event.body);
  
      // 1. Build the POST body with form data so Netlify recognizes it as a form submission.
      //    We'll use URLSearchParams to mimic a standard HTML form submission.
      const formName = 'survey'; // Must match the <form name="survey"> in your HTML
      const postData = new URLSearchParams();
      postData.append('form-name', formName);
  
      // Append the fields you want to store
      // For example, if your AMP form includes <input name="feedback" />, pass that through:
      if (data.experience) postData.append('feedback', data.experience);
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
        throw new Error(`Netlify form submission failed: ${netlifyResponse.status}`);
      }
  
      // 4. Return a JSON response that AMP expects
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // For AMP in email
        },
        body: JSON.stringify({
          success: true,
          message: 'Survey data stored in Netlify Forms',
          receivedData: data,
        }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  