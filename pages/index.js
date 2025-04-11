import { useState } from "react";
import Head from "next/head";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [expireAfter, setExpireAfter] = useState(24);
  const [copied, setCopied] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expireAfter", expireAfter);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      setUrl(res.url);
    };

    xhr.send(formData);
  };

  return (
    <div className="container" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Head>
        <title>BuzzHeavier Clone</title>
      </Head>
      <h1>Upload File</h1>
      <div className="upload-area">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        {file && (
          <div className="file-info">
            <p><strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
          </div>
        )}
        <label>Hapus file setelah:</label>
        <select value={expireAfter} onChange={(e) => setExpireAfter(e.target.value)}>
          <option value="1">1 jam</option>
          <option value="6">6 jam</option>
          <option value="24">1 hari</option>
          <option value="72">3 hari</option>
        </select>
        <br/>
        <button onClick={handleUpload}>Upload</button>
        {progress > 0 && <progress value={progress} max="100" />}
      </div>

      {url && (
        <div className="result">
          <p>Link:</p>
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
          <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
            <button>{copied ? "Copied!" : "Copy Link"}</button>
          </CopyToClipboard>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          background: #111;
          color: #fff;
          font-family: sans-serif;
          text-align: center;
          min-height: 100vh;
        }
        .upload-area {
          border: 2px dashed #555;
          padding: 2rem;
          margin-top: 1rem;
        }
        input {
          margin-bottom: 1rem;
        }
        button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
        }
        .result {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}