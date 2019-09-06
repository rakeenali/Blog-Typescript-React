import '@testing-library/jest-dom/extend-expect'
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";

import Error from "../Error";

describe("<Error/>", () => {

    test("render correctly", () => {
        const props = {
            message: "An error message",
            closeError: jest.fn()
        }
        const { container } = render(<Error {...props} />)
        expect(container.firstChild).toMatchSnapshot();
    })

    test("render the message and fire the close event", () => {
        const props = {
            message: "An error message",
            closeError: jest.fn()
        }

        const { queryByText, container } = render(<Error {...props} />)
        const closeButton = container.querySelector('button');

        expect(queryByText(/An error message/)).toBeInTheDocument()
        if (closeButton) {
            fireEvent.click(closeButton);
        }
        expect(props.closeError).toHaveBeenCalledTimes(1);
    });
})