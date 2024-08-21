"use client";
import { Button, Row, Col, Input } from "reactstrap";

export default function GuidePlaceSortFilter({
    sort,
    setSort,
    filter,
    setFilter,
    distinctGuideTags,
}) {
    return (
        <Row className="sort-and-filter mb-3">
            <Col xs="12" sm="4" className="sort-section mb-xs-3">
                <span>Sort: </span>
                <Button
                    color="primary"
                    outline={sort !== "rec"}
                    onClick={() => setSort("rec")}
                    className="me-2"
                >
                    Rec
                </Button>
                <Button
                    color="primary"
                    outline={sort !== "rating"}
                    onClick={() => setSort("rating")}
                >
                    Rating
                </Button>
            </Col>
            <Col xs="12" sm="6" className="filter-section">
                <span>Filter: </span>
                <Input
                    id="filter"
                    name="filter"
                    type="select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="tag-filter-input"
                    aria-label="Filter"
                >
                    <option value="">
                        {distinctGuideTags.length ? "Select a tag..." : "No tags yet"}
                    </option>
                    {distinctGuideTags.map((tagName) => (
                        <option key={tagName}>{tagName}</option>
                    ))}
                </Input>
                {filter && (
                    <span className="nav-link" onClick={() => setFilter("")}>
                        Remove Filter
                    </span>
                )}
            </Col>
        </Row>
    );
}
