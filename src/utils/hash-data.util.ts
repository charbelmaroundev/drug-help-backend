import * as bcrypt from 'bcrypt';

//* Hash data
export const hashData = async (data: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt();
  const hash: string = await bcrypt.hash(data, salt);

  return hash;
};
