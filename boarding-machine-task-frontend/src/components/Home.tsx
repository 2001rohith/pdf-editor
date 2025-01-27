import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadPDF, createNewPDF } from "../services/FileService";
import { PDFDocument } from "pdf-lib";
import { BACKEND_URL } from "../utils/axiosUrl";

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("backend url:", BACKEND_URL)
  const user = location.state?.user || { name: "Guest" };
  const [userId] = useState<string>(user._id);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [newPdfPath, setNewPdfPath] = useState<string | null>(null);


  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setMessage(null);
    } else {
      setMessage("Please upload a valid PDF file.");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    try {
      const response = await uploadPDF(file, userId);
      const sanitizedPdfPath = response.pdfPath.replace(/\\/g, "/");

      setPdfPath(sanitizedPdfPath);
      setMessage("File uploaded successfully.");

      const existingPdfBytes = await fetch(sanitizedPdfPath).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      setNumPages(pdfDoc.getPageCount());
    } catch (error: any) {
      setMessage("Error uploading file. Please try again.");
      console.error(error);
    }
  };

  const handleCheckboxChange = (pageNumber: number) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageNumber)) {
        return prev.filter((page) => page !== pageNumber);
      }
      return [...prev, pageNumber];
    });
  };

  const handleGenerateNewPDF = async () => {
    if (!pdfPath || selectedPages.length === 0) {
      setMessage("Please select a PDF and at least one page.");
      return;
    }

    try {
      const response = await createNewPDF(userId, pdfPath, selectedPages);
      setNewPdfPath(response.newPdfPath)
      setMessage("New PDF generated successfully.");
    } catch (error: any) {
      setMessage("Error generating new PDF. Please try again.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="login-title">Welcome to PDF Editor</h1>
      <p className="lead">Hello, {user.name}!</p>
      <button className="btn btn-danger mb-4" onClick={handleLogout}>
        Logout
      </button>

      <div className="upload-form mt-4">
        <h3>Upload a PDF</h3>
        {message && <p className="text-danger">{message}</p>}
        <input
          type="file"
          accept="application/pdf"
          className="form-control mb-3"
          onChange={handleFileChange}
        />
        <button
          className="btn  sign-in-button"
          onClick={handleFileUpload}
          disabled={!file}
        >
          Upload PDF
        </button>
      </div>

      {pdfPath && (
        <div className="pdf-viewer mt-5">
          <h3>Uploaded PDF</h3>
          <embed
            src={pdfPath}
            type="application/pdf"
            width="100%"
            height="500px"
          />
          <div className="page-selection mt-3">
            <h5>Select Order</h5>
            {Array.from({ length: numPages }).map((_, index) => (
              <div key={index} className="d-inline-block mx-2">
                <input
                  type="checkbox"
                  id={`page-${index + 1}`}
                  checked={selectedPages.includes(index + 1)}
                  onChange={() => handleCheckboxChange(index + 1)}
                />
                <label htmlFor={`page-${index + 1}`} className="ms-1">
                  Page {index + 1}
                </label>
              </div>
            ))}
          </div>
          <p className="mt-2">
            Selected Order: {selectedPages.join(", ") || "None"}
          </p>
          <button
            className="btn sign-in-button mt-3"
            onClick={handleGenerateNewPDF}
            disabled={selectedPages.length === 0}
          >
            Generate New PDF
          </button>
        </div>
      )}

      {newPdfPath && (
        <div className="new-pdf mt-5">
          <h3>New PDF Created</h3>
          <a
            href={`${BACKEND_URL}${newPdfPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn sign-in-button"
          >
            Download New PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
