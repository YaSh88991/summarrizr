import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TextSummarizer from "../textSummarizr";

// Mock dependencies
jest.mock("../../utils/handleSummary", () => ({
  handleSummarizeAPI: jest.fn(),
}));
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

describe("TextSummarizer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders textarea, file uploader, and summarize button", () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Paste or type the text/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click or drag a .txt file here to upload/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Summarize/i })
    ).toBeInTheDocument();
  });

  test("summarize button is disabled when textarea is empty", () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const button = screen.getByRole("button", { name: /Summarize/i });
    expect(button).toBeDisabled();
  });

  test("enables summarize button when textarea has text", () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, {
      target: { value: "Some text to summarize." },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    expect(button).not.toBeDisabled();
  });

  test("calls handleSummarizeAPI when summarize button is clicked", () => {
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    render(<TextSummarizer triggerScroll={() => {}} />);
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, {
      target: { value: "Some text to summarize." },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(handleSummarizeAPI).toHaveBeenCalled();
  });

  test("shows loader when loading", () => {
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    handleSummarizeAPI.mockImplementation(({ setLoading }) => setLoading(true));
    render(<TextSummarizer triggerScroll={() => {}} />);
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, {
      target: { value: "Some text to summarize." },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  test("shows error for invalid file type", async () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const invalidFile = new File(["dummy"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    await waitFor(() => {
      expect(
        screen.getByText(/Please provide a text \(.*\.txt.*\) file!/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error for file too large", async () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "big.txt", {
      type: "text/plain",
    });
    Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    await waitFor(() => {
      expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
    });
  });

  test("loads file content into textarea", async () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["This is file content."], "test.txt", {
      type: "text/plain",
    });
    // Mock the .text() method
    file.text = () => Promise.resolve("This is file content.");
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(
        screen.getByDisplayValue("This is file content.")
      ).toBeInTheDocument();
    });
  });

  test("clears file when textarea is edited", async () => {
    render(<TextSummarizer triggerScroll={() => {}} />);
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["This is file content."], "test.txt", {
      type: "text/plain",
    });
    // Mock the .text() method
    file.text = () => Promise.resolve("This is file content.");
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(
        screen.getByDisplayValue("This is file content.")
      ).toBeInTheDocument();
    });
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, { target: { value: "User typed text." } });
    expect(textarea.value).toBe("User typed text.");
  });

  test("displays summary and allows copying", async () => {
    // Simulate summary state by calling setSummary directly via mock
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    handleSummarizeAPI.mockImplementation(({ setSummary }) =>
      setSummary("Summary here.")
    );
    render(<TextSummarizer triggerScroll={() => {}} />);
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, {
      target: { value: "Some text to summarize." },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText("Summary here.")).toBeInTheDocument();
    const copyButton = screen.getByRole("button", { name: /Copy/i });
    fireEvent.click(copyButton);
    const { handleCopyToClipboard } = require("../../utils/copyToClipboard");
    expect(handleCopyToClipboard).toHaveBeenCalled();
  });

  test("displays error message", async () => {
    // Simulate error state by calling setError directly via mock
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    handleSummarizeAPI.mockImplementation(({ setError }) =>
      setError("Some error!")
    );
    render(<TextSummarizer triggerScroll={() => {}} />);
    const textarea = screen.getByPlaceholderText(/Paste or type the text/i);
    fireEvent.change(textarea, {
      target: { value: "Some text to summarize." },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(await screen.findByText(/Some error!/i)).toBeInTheDocument();
  });
});
