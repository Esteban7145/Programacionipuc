import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/ipuc-proyeccion';

declare global {
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

export const connectDB = async () => {
  if (!global.mongooseConn) {
    global.mongooseConn = mongoose.connect(MONGODB_URI, { dbName: 'ipuc_proyeccion' });
  }
  return global.mongooseConn;
};
