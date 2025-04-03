import { Response } from "express-serve-static-core";
export const handleErrors = (
  error: unknown,
  res: Response,
  status = 500,
  message = "Internal Server Error"
) => {
  console.error(error);
  res.status(status).send(message);
  return;
};
