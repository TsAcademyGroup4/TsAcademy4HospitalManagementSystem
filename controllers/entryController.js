import { StatusCodes } from "http-status-codes";

export const greetingMessage = (req,res) => {
  res.status(StatusCodes.OK).json({ message: "Welcome to TsAcademy Group 4 Project" });
}