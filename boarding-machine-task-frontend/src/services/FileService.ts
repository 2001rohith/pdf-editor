import axios from "axios";
import { BACKEND_URL } from "../utils/axiosUrl";

export const uploadPDF = async (file: File, userId: string) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("userId", userId);

    const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response from server:", response)
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to upload the PDF";
  }
}

export const createNewPDF = async (userId: string, pdfPath: string, pageOrder: number[]) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/generate-new-pdf`, {
      userId,
      pdfPath,
      pageOrder,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create the new PDF";
  }
};

