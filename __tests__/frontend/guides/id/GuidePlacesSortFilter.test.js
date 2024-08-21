import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GuidePlaceSortFilter from "@/app/guides/[id]/_components/GuidePlaceSortFilter";

describe("GuidePlaceSortFilter", () => {
    const mockSetSort = jest.fn();
    const mockSetFilter = jest.fn();
    const distinctGuideTags = ["tag1", "tag2", "tag3"];

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly", () => {
        render(
            <GuidePlaceSortFilter
                sort="rec"
                setSort={mockSetSort}
                filter=""
                setFilter={mockSetFilter}
                distinctGuideTags={distinctGuideTags}
            />
        );

        expect(screen.getByText("Sort:")).toBeInTheDocument();
        expect(screen.getByText("Filter:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Rec" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Rating" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Select a tag..." })).toBeInTheDocument();
        distinctGuideTags.forEach((tag) => {
            expect(screen.getByRole("option", { name: tag })).toBeInTheDocument();
        });
    });

    test("triggers sort button clicks", () => {
        render(
            <GuidePlaceSortFilter
                sort="rec"
                setSort={mockSetSort}
                filter=""
                setFilter={mockSetFilter}
                distinctGuideTags={distinctGuideTags}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Rating" }));
        expect(mockSetSort).toHaveBeenCalledWith("rating");

        fireEvent.click(screen.getByRole("button", { name: "Rec" }));
        expect(mockSetSort).toHaveBeenCalledWith("rec");
    });

    test("triggers filter selection", () => {
        render(
            <GuidePlaceSortFilter
                sort="rec"
                setSort={mockSetSort}
                filter=""
                setFilter={mockSetFilter}
                distinctGuideTags={distinctGuideTags}
            />
        );

        fireEvent.change(screen.getByRole("combobox", { name: "Filter" }), {
            target: { value: "tag1" },
        });
        expect(mockSetFilter).toHaveBeenCalledWith("tag1");
    });

    test("removes filter", () => {
        render(
            <GuidePlaceSortFilter
                sort="rec"
                setSort={mockSetSort}
                filter="tag1"
                setFilter={mockSetFilter}
                distinctGuideTags={distinctGuideTags}
            />
        );

        fireEvent.click(screen.getByText("Remove Filter"));
        expect(mockSetFilter).toHaveBeenCalledWith("");
    });
});
