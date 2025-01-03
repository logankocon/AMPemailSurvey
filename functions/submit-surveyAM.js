

exports.handler = async (event, context) => {
    // 1. Check the request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  

        // Log or process the data
    Console.WriteLine(requestBody["action"]?.ToString());
    Console.WriteLine(requestBody["comments"]?.ToString());
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log("fail");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }
  
    // 3. Handle the action - e.g., store data, trigger workflow, etc.
    // For example, suppose the card body had: { "choice": "approved" }
    console.log('Received data from Outlook Actionable Message:', data);
  
    // 4. Return a response
    // Typically, you’d just confirm success with a 200 OK.
    // If you want to do a "card refresh" or updated content,
    // you’d send back another JSON body representing the new card state.
    // But for basic scenarios, a simple success message is enough.
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Action received successfully!',
        receivedData: data,
      }),
    };
  };
  