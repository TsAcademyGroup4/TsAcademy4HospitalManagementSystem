import { StatusCodes, ReasonPhrases } from "http-status-codes";
import authService from "../services/authService.js"; // we'll create this

export const login = async (req, res) => {
  try {
    const { actor } = req.params;
    const { email, password } = req.body;

    if (!email || !password || !actor) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
    }

    const result = await authService.loginUser({ email, password, actor });

    res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      data: result,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};