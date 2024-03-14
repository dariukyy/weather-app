import { NextResponse } from "next/server";
import { openai } from "@/openai";

export async function POST(request: Request) {
  // weether in the body of the POST req
  const { weatherData } = await request.json();

  const responce = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "Pretend you're a weather news presenter presenting LIVE on television. Be energetic and full of charisma. Introduce yourself as Darius. State the city you are providing a summary for. Then give a summary of todays weather only. Make it easy to the viewers to understand and know what to do to prepare for those weather conditions such as wear SPF if the UV is high etc. us ethe uv_index data provided to provide UV advice etc. Provide a joke regarding the weather. Assume the data came from your team at the news office and not the user.",
      },
      {
        role: "user",
        content: `Hi there , can i get a summary of todays weather, use the following information to get the weather data: ${JSON.stringify(
          weatherData
        )}`,
      },
    ],
  });

  const { choices } = responce;

  return NextResponse.json({ data: choices[0].message.content });
}
