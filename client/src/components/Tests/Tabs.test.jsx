import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '../Tabs';

test('renders all labels', () => {
    const tabs = [
        { id: "pdf", label: "PDF" },
        { id: "video", label: "Video" },
        { id: "text", label: "Text" },
        { id: "docs", label: "Docs" },
        { id: "pptx", label: "PPTs" },
        { id: "excel", label: "Excel" }
    ];

    render(<Tabs current="pdf" setCurrent={() => {}} tabs={tabs} />);
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("PPTs")).toBeInTheDocument();
    expect(screen.getByText("Excel")).toBeInTheDocument();  
});

test('calls setCurrent when tab is clicked', () => {
    const tabs = [
        { id: "pdf", label: "PDF" },
        { id: "video", label: "Video" },
        { id: "text", label: "Text" },
        { id: "docs", label: "Docs" },
        { id: "pptx", label: "PPTs" },
        { id: "excel", label: "Excel" }
    ];

    const setCurrent = jest.fn();
    render(<Tabs current="pdf" setCurrent={setCurrent} tabs={tabs} />);
    fireEvent.click(screen.getByText("Video"));
    expect(setCurrent).toHaveBeenCalledWith("video");
});

test('applies active class to the current tab', () => {
  const tabs = [
    { id: "pdf", label: "PDF" },
    { id: "video", label: "Video" },
    { id: "text", label: "Text" },
    { id: "docs", label: "Docs" },
    { id: "pptx", label: "PPTs" },
    { id: "excel", label: "Excel" }
  ];
  render(<Tabs current="video" setCurrent={() => {}} tabs={tabs} />);
  const activeTab = screen.getByText("Video");
  expect(activeTab.className).toMatch(/scale-110/); // or whatever class you use for active
});