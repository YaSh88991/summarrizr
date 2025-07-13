import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PptSummarizr from "../PptSummarizr";

jest.mock("../../utils/copyToClipboard", () => ({
  handleCopyToClipboard: jest.fn(),
}));
jest.mock("../Loader", () => () => <div>Loader</div>);
jest.mock("../FileUploader", () => (props) => (
  <div>
    <input
      data-testid="file-input"
      type="file"
      onChange={(e) => {
        const file = e.target.files && e.target.files[0];
        props.onFile && props.onFile(file);
      }}
    />
    {props.label}
  </div>
));

describe("PptSummarizr", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders file uploader and summarize button", () => {
    render(<PptSummarizr triggerScroll={() => {}} />);
    expect(
      screen.getByText(/Click or drag a .pptx file here to upload/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Summarize/i })
    ).toBeInTheDocument();
  });

  test("summarize button is disabled when no file is uploaded", () => {
    render(<PptSummarizr triggerScroll={() => {}} />);
    const button = screen.getByRole("button", { name: /Summarize/i });
    expect(button).toBeDisabled();
  });

  test("shows error for invalid file type", async () => {
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const invalidFile = new File(["dummy"], "test.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    await waitFor(() => {
      expect(
        screen.getByText(/Please provide a PPTX file!/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error for file too large", async () => {
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const largeFile = new File(["a".repeat(11 * 1024 * 1024)], "big.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    await waitFor(() => {
      expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
    });
  });

  test("enables summarize button for valid file", async () => {
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["dummy"], "test.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const button = screen.getByRole("button", { name: /Summarize/i });
    expect(button).not.toBeDisabled();
  });

  test("shows loader when loading", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ summary: "PPTX summary here." }),
              }),
            100
          )
        )
    );
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["dummy"], "test.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText("Loader")).toBeInTheDocument();
    global.fetch.mockClear();
  });

  test("displays summary and allows copying", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ summary: "PPTX summary here." }),
      })
    );
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["dummy"], "test.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText("PPTX summary here.")).toBeInTheDocument();
    const copyButton = screen.getByRole("button", { name: /Copy/i });
    fireEvent.click(copyButton);
    const { handleCopyToClipboard } = require("../../utils/copyToClipboard");
    expect(handleCopyToClipboard).toHaveBeenCalled();
    global.fetch.mockClear();
  });

  test("displays error message from API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "API error!" }),
      })
    );
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["dummy"], "test.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText(/API error!/i)).toBeInTheDocument();
    global.fetch.mockClear();
  });

  test("displays error on fetch failure", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));
    render(<PptSummarizr triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["dummy"], "test.pptx", {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText(/Failed to connect to Server/i)).toBeInTheDocument();
    global.fetch.mockClear();
  });
});