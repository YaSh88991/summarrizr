const { OpenAI } = require("openai");

//setting up OpenAI obj
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getSummaryFromOpenAI(
  prompt,
  model = "gpt-4.1-nano",
  temperature = 0.5,
  max_tokens = undefined
) {
  const options = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature,
  };
  if (max_tokens) options.max_tokens = max_tokens;

  try {
    const completion = await openai.chat.completions.create(options);

    return completion.choices[0]?.message?.content?.trim() || "";

  } catch (err) {
    console.error("OpenAI API error:", err);
    throw err;
  }
}

module.exports = { getSummaryFromOpenAI };
