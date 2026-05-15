import OpenAI from 'openai';

export function createAIClient(apiKey) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function generateDevotional(client, prompt) {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Crea un devocional cristiano pentecostal breve: ${prompt}`
  });

  return response.output_text;
}
