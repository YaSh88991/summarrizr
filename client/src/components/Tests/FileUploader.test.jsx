import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileUploader from "../FileUploader";

describe("FileUploader", () => {
  const defaultProps = {
    accept: ".txt,text/plain",
    label: "Upload your file",
    helperText: "Only .txt files allowed",
    onFile: jest.fn(),
    disabled: false,
    maxSizeMB: 5,
    file: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders label and helper text", () => {
    render(<FileUploader {...defaultProps} />);
    expect(screen.getByText("Upload your file")).toBeInTheDocument();
    expect(screen.getByText("Only .txt files allowed")).toBeInTheDocument();
  });

  test("calls onFile with file on file input change", () => {
    render(<FileUploader {...defaultProps} />);
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    const input = screen
      .getByRole("button")
      .querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });
    expect(defaultProps.onFile).toHaveBeenCalledWith(file);
  });
  
  test("shows file info and remove button when file is present", () => {
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    render(<FileUploader {...defaultProps} file={file} />);
    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })[0]).toBeInTheDocument();
  });

  test("handles drag over and drop events", () => {
    render(<FileUploader {...defaultProps} />);
    const dropzone = screen.getByRole("button");
    fireEvent.dragOver(dropzone);
    // Can't reliably test className change in JSDOM, but can test drop event
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
      preventDefault: () => {},
    });
    expect(defaultProps.onFile).toHaveBeenCalledWith(file);
  });

  test("does not allow interaction when disabled", () => {
    render(<FileUploader {...defaultProps} disabled={true} />);
    const dropzone = screen.getByRole("button");
    expect(dropzone).toHaveClass("opacity-60");
    fireEvent.click(dropzone);
    expect(defaultProps.onFile).not.toHaveBeenCalled();
  });

  test("shows default label if none provided", () => {
    render(<FileUploader {...defaultProps} label={undefined} />);
    expect(
      screen.getByText(/Click or drag a file here to upload/i)
    ).toBeInTheDocument();
  });
});