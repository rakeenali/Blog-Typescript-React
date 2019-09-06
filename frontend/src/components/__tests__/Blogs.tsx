import '@testing-library/jest-dom/extend-expect';
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { navigate } from "@reach/router";

import { generateBlogs } from "../../test/buildBlog";

import Blogs from "../Blogs";


jest.mock("@reach/router", () => {
    const navigate = jest.fn();
    return {
        navigate
    }
});


beforeEach(() => {
    const mockNavigate = navigate as jest.Mock
    mockNavigate.mockClear();
})

describe("<Blogs/>", () => {

    test("render blogs and navigation correctly", () => {
        const count = 2
        const blogs = generateBlogs(count);
        const { getByText, container, queryByText } = render(<Blogs blogs={blogs} />);

        const renderedBlogs = container.querySelectorAll(".blog-area");

        expect(getByText(blogs[0].title)).toBeInTheDocument();
        expect(getByText(blogs[1].title)).toBeInTheDocument();
        expect(queryByText(/No blogs to show/i)).not.toBeInTheDOM();


        renderedBlogs.forEach(fireEvent.click);
        expect(navigate).toHaveBeenCalledTimes(count);
    });

    test("handles empty blogs correctly", () => {
        const blogs = generateBlogs(0);

        const { getByText } = render(<Blogs blogs={blogs} />);
        expect(getByText(/No blogs to show/i)).toBeInTheDOM();
    })

})