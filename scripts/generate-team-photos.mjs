import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const members = [
  {
    name: "luka-horvat",
    prompt:
      "Professional corporate headshot portrait of a 36-year-old Central European man with short brown hair and light stubble, wearing a dark navy blazer over a white shirt, warm confident smile, soft studio lighting, clean light gray background, high-end corporate photography, sharp focus on face, shallow depth of field",
  },
  {
    name: "ana-krajnc",
    prompt:
      "Professional corporate headshot portrait of a 31-year-old Central European woman with shoulder-length dark brown hair, wearing a modern charcoal blazer, friendly warm smile, soft studio lighting, clean light gray background, high-end corporate photography, sharp focus on face, shallow depth of field",
  },
  {
    name: "matej-zupan",
    prompt:
      "Professional corporate headshot portrait of a 33-year-old Central European man with medium-length brown hair and glasses with thin dark frames, wearing a smart casual dark sweater, approachable expression, soft studio lighting, clean light gray background, high-end corporate photography, sharp focus on face, shallow depth of field",
  },
];

const dir = path.join(process.cwd(), "public/images/team");
fs.mkdirSync(dir, { recursive: true });

for (const member of members) {
  console.log(`Generating photo for ${member.name}...`);
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: member.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    const imgResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    fs.writeFileSync(path.join(dir, `${member.name}.png`), buffer);
    console.log(`  Saved ${member.name}.png`);
  } catch (err) {
    console.error(`  Error for ${member.name}:`, err.message);
  }
}

console.log("Done!");
