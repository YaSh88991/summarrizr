import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../App";

// Mock all summarizer components to simple stubs for isolation
jest.mock("../VideoSummarizr", () => () => <div>VideoSummarizer</div>);
jest.mock("../textSummarizr", () => () => <div>TextSummarizer</div>);
jest.mock("../PdfSummarizr", () => () => <div>PdfSummarizr</div>);
jest.mock("../DocsSummarizr", () => () => <div>DocsSummarizr</div>);
jest.mock("../PptSummarizr", () => () => <div>PptSummarizr</div>);
jest.mock("../ExcelSummarizr", () => () => <div>ExcelSummarizr</div>);

describe("App", () => {
  test("renders without crashing and shows default tab", () => {
    render(<App />);
    expect(screen.getByText("VideoSummarizer")).toBeInTheDocument();
  });

  test("switches to Text tab when clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Text"));
    expect(screen.getByText("TextSummarizer")).toBeInTheDocument();
  });

  test("switches to PDF tab when clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("PDF"));
    expect(screen.getByText("PdfSummarizr")).toBeInTheDocument();
  });

  test("switches to Docs tab when clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Docs"));
    expect(screen.getByText("DocsSummarizr")).toBeInTheDocument();
  });

  test("switches to PPTs tab when clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("PPTs"));
    expect(screen.getByText("PptSummarizr")).toBeInTheDocument();
  });

  test("switches to Excel tab when clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Excel"));
    expect(screen.getByText("ExcelSummarizr")).toBeInTheDocument();
  });

  test("shows About modal when About is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("About"));
    expect(screen.getByText("About Sumarrizr")).toBeInTheDocument();
    expect(
      screen.getByText(/lets you instantly generate/i)
    ).toBeInTheDocument();
  });
  test("closes About modal when close button is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("About"));
    // There are two "Close" buttons: one in the drawer, one in the About modal.
    // The About modal's close button is rendered last, so use the last one.
    const closeButtons = screen.getAllByLabelText("Close");
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(screen.queryByText("About Sumarrizr")).not.toBeInTheDocument();
  });

  // Example for responsive: simulate mobile by resizing window
  test("shows mobile tabs in drawer when isMobile is true", () => {
    // Mock window.innerWidth before rendering
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    render(<App />);
    // Open the drawer
    fireEvent.click(screen.getByLabelText("Menu"));
    // All tab buttons should be visible in the drawer
    const pdfButtons = screen.getAllByText("PDF");
    expect(pdfButtons.length).toBeGreaterThan(0);
    const videoButtons = screen.getAllByText("Video");
    expect(videoButtons.length).toBeGreaterThan(0);
    const textButtons = screen.getAllByText("Text");
    expect(textButtons.length).toBeGreaterThan(0);
    const docsButtons = screen.getAllByText("Docs");
    expect(docsButtons.length).toBeGreaterThan(0);
    const pptButtons = screen.getAllByText("PPTs");
    expect(pptButtons.length).toBeGreaterThan(0);
    const excelButtons = screen.getAllByText("Excel");
    expect(excelButtons.length).toBeGreaterThan(0);
  });

  test("opens and closes the drawer when menu and close are clicked", () => {
    render(<App />);
    // Open drawer
    fireEvent.click(screen.getByLabelText("Menu"));
    const drawer = screen.getByRole("complementary");
    expect(drawer.className).toContain("translate-x-0");
    // Close drawer
    const closeButtons = screen.getAllByLabelText("Close");
    fireEvent.click(closeButtons[0]);
    // Drawer should be closed (off-screen)
    expect(drawer.className).toContain("translate-x-full");
  });

  test("switches tab via mobile drawer", () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    render(<App />);
    fireEvent.click(screen.getByLabelText("Menu"));
    const textTabButtons = screen.getAllByText("Text");
    fireEvent.click(textTabButtons[0]);
    expect(screen.getByText("TextSummarizer")).toBeInTheDocument();
  });

  test("About modal displays correct content", () => {
    render(<App />);
    fireEvent.click(screen.getByText("About"));
    expect(screen.getByText("About Sumarrizr")).toBeInTheDocument();
    expect(
      screen.getByText(/instantly generate a 100 word summary/i)
    ).toBeInTheDocument();
  });

  test("renders footer with current year", () => {
    render(<App />);
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()}`))
    ).toBeInTheDocument();
  });
});
