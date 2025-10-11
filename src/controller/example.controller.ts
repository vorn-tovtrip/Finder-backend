import { Request, Response } from "express";
import { ApiResponse } from "../types";
import ExampleService from "../service/example.service";

const getAllData = (req: Request, res: Response<ApiResponse<any>>) => {
  const data = ExampleService.findAll();
  res.status(200).json({
    code: 200,
    message: "success",
    data: data,
  });
};
const ExampleController = {
  getAllData,
};

export default ExampleController;
