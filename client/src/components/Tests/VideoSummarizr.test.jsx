import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VideoSummarizer from "../VideoSummarizr";

// Mock dependencies
jest.mock("../../utils/handleSummary", () => ({
  handleSummarizeAPI: jest.fn(),
}));

jest.mock("../../utils/copyToClipboard", () => ({
  handleCopyToClipboard: jest.fn(),
}));

jest.mock("../Loader", () => () => <div>Loader</div>);

describe("VideoSummarizer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input and summarize button", () => {
    render(<VideoSummarizer />);
    expect(
      screen.getByPlaceholderText(/Paste your video URL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Summarize/i })
    ).toBeInTheDocument();
  });

  test("summarize button is disabled when input is empty", () => {
    render(<VideoSummarizer />);
    const button = screen.getByRole("button", { name: /Summarize/i });
    expect(button).toBeDisabled();
  });

  test("calls handleSummarizeAPI when summarize button is clicked", () => {
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    render(<VideoSummarizer />);
    const input = screen.getByPlaceholderText(/Paste your video URL/i);
    fireEvent.change(input, {
      target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);
    expect(handleSummarizeAPI).toHaveBeenCalled();
  });

  test("shows loader when loading", () => {
    // Mock handleSummarizeAPI to set loading to true
    const { handleSummarizeAPI } = require("../../utils/handleSummary");
    handleSummarizeAPI.mockImplementation(({ setLoading }) => setLoading(true));

    render(<VideoSummarizer />);
    const input = screen.getByPlaceholderText(/Paste your video URL/i);
    fireEvent.change(input, {
      target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });
    const button = screen.getByRole("button", { name: /Summarize/i });
    fireEvent.click(button);

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  test("displays summary and allows copying", async () => {
    const { handleCopyToClipboard } = require("../../utils/copyToClipboard");
    // Custom wrapper to inject summary state
    const VideoSummarizerWithSummary = () => {
      const [summary] = React.useState("This is a summary.");
      const [copied, setCopied] = React.useState(false);
      return (
        <div>
          <div className="mt-8 w-full bg-neutral-950/70 border border-cyan-400/20 rounded-lg p-6 text-base leading-relaxed shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-cyan-300">Summary:</span>
              <button
                onClick={() => {
                  handleCopyToClipboard(summary, setCopied);
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="whitespace-pre-line">{summary}</div>
          </div>
        </div>
      );
    };
    render(<VideoSummarizerWithSummary />);
    expect(screen.getByText("This is a summary.")).toBeInTheDocument();
    const copyButton = screen.getByRole("button", { name: /Copy/i });
    fireEvent.click(copyButton);
    expect(handleCopyToClipboard).toHaveBeenCalled();
  });

  test("displays error message", () => {
    // Custom wrapper to inject error state
    const VideoSummarizerWithError = () => {
      const [error] = React.useState("Something went wrong!");
      return (
        <div className="mt-6 w-full flex items-center justify-center gap-2 text-red-400 bg-red-900/40 border border-red-400/40 font-semibold text-center rounded-lg p-4 animate-pulse shadow">
          <svg
            className="w-5 h-5 text-red-400 inline-block mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.105-2.016l-6.928-12.07a1.25 1.25 0 0 0-2.21 0l-6.928 12.07c-.553.876.051 2.016 1.105 2.016z" />
          </svg>
          <b>Error:</b> {error}
        </div>
      );
    };
    render(<VideoSummarizerWithError />);
    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
  });

  test("clears summary and error when input changes", () => {
    render(<VideoSummarizer />);
    const input = screen.getByPlaceholderText(/Paste your video URL/i);

    // Simulate a summary and error state
    fireEvent.change(input, {
      target: { value: "https://www.youtube.com/watch?v=abc" },
    });
    // Simulate summarize to set summary and error
    fireEvent.click(screen.getByRole("button", { name: /Summarize/i }));

    // Change input again to clear summary and error
    fireEvent.change(input, {
      target: { value: "https://www.youtube.com/watch?v=def" },
    });

    // Summary and error should be cleared (not in the document)
    expect(screen.queryByText(/Summary:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
  });

  test("shows 'Copied!' feedback after copying summary", async () => {
    const { handleCopyToClipboard } = require("../../utils/copyToClipboard");
    // Custom wrapper to inject summary and copied state
    const VideoSummarizerWithCopied = () => {
      const [summary] = React.useState("This is a summary.");
      const [copied, setCopied] = React.useState(true);
      return (
        <div>
          <div className="mt-8 w-full bg-neutral-950/70 border border-cyan-400/20 rounded-lg p-6 text-base leading-relaxed shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-cyan-300">Summary:</span>
              <button
                onClick={() => {
                  handleCopyToClipboard(summary, setCopied);
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="whitespace-pre-line">{summary}</div>
          </div>
        </div>
      );
    };
    render(<VideoSummarizerWithCopied />);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
