import React, { useEffect, useState } from "react";
import axios from "axios"; // Đảm bảo import axios
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const FileDetails = () => {
  const { encodedKey, courseId } = useParams();

  // Giải mã key từ Base64
  let decodedKey = "";
  try {
    decodedKey = atob(encodedKey);
  } catch (err) {
    console.error("Error decoding fileKey:", err);
    return <p>Error decoding file information</p>;
  }

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.post("/api/object-url", { key: decodedKey });
        setFile(response.data.url);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching file:", err);
        setError("Error fetching file");
        setLoading(false);
      }
    };
    fetchFile();
  }, [decodedKey]);

  if (loading) return <p>Loading file details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      {/* Điều chỉnh vị trí bằng Tailwind CSS */}
      <div className="-mt-7">
        {file && (
          <div className="mt-4">
            {/* Tiêu đề */}
            <p className="text-black font-outfit text-2xl font-normal">
              {file.fileName}
            </p>

            {/* Link Tải về */}
            <a
              href={file.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-outfit text-lg font-normal underline"
            >
              Download File {file.fileName}
            </a>

            {/* Hiển thị Tài liệu */}
            <div
              className="w-[1000px] h-[550px] overflow-y-auto border border-gray-300 rounded-lg p-2"
            >
              <DocViewer
                documents={[{ uri: file.signedUrl, fileType: file.fileType }]}
                pluginRenderers={DocViewerRenderers}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FileDetails;