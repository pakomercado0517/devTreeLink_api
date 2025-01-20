import mongoose from "mongoose";
import colors from "colors";
const {DATABASE_URL} = process.env

export const connectDB = async () => {
  try {

    const {connection} = await mongoose.connect(DATABASE_URL as string)
    const urlConnection = `${connection.host}:${connection.port}/${connection.name}`
    console.log(`MongoDb connected on: ${urlConnection}`.cyan.underline)
  } catch (error) {
    if (error instanceof Error) {
      console.log(colors.red(error.message))
      process.exit(1)
    } else {
      console.log(String(error))
    }
  }
}