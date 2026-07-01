import { ViolationService } from './src/apps/violations/violations.service';
import dotenv from 'dotenv';
dotenv.config();

const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

async function run() {
  try {
    const res = await ViolationService.analyzeImage(undefined, base64Image);
    console.log("Success:", res);
  } catch (err) {
    console.error("Failed:", err);
  }
}

run();
